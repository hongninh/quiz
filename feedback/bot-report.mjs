// Bot kiểm thử: tự chơi quiz, chụp màn hình từng bước và gửi phản hồi về NocoBase
// (bảng phản hồi có trường tệp đính kèm cho ảnh chụp).
//
// Cài:    npm i -D playwright
// Chạy:   node feedback/bot-report.mjs <url-quiz> [tester-code]
// Ví dụ:  node feedback/bot-report.mjs "file://$PWD/feedback/demo.html" bot-01
//
// Gửi về NocoBase (bỏ trống NOCOBASE_URL = chỉ lưu file cục bộ):
//   NOCOBASE_URL=https://nocobase.example.com/api   (có /api ở cuối)
//   NOCOBASE_API_KEY=...                            (Settings > API keys, role chỉ cần quyền tạo phản hồi)
//   NOCOBASE_COLLECTION=quiz_feedbacks              (mặc định)
//
// Selector quiz (đổi nếu giao diện quiz khác):
//   ANSWER_SELECTOR=.answer-btn  NEXT_SELECTOR=#next-btn  RESULT_SELECTOR=#result-section
//
// Kết quả cục bộ: feedback-reports/<thời-gian>-<tester>/report.json, report.md, step-*.png

import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [url, testerCode = 'bot-01'] = process.argv.slice(2);
if (!url) {
    console.error('Cách dùng: node feedback/bot-report.mjs <url-quiz> [tester-code]');
    process.exit(1);
}

const env = process.env;
const ANSWER_SELECTOR = env.ANSWER_SELECTOR || '.answer-btn';
const NEXT_SELECTOR = env.NEXT_SELECTOR || '#next-btn';
const RESULT_SELECTOR = env.RESULT_SELECTOR || '#result-section';
const MAX_STEPS = 50;

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join('feedback-reports', `${stamp}-${testerCode}`);
await mkdir(outDir, { recursive: true });

const pageUrl = new URL(url);
pageUrl.searchParams.set('tester', testerCode);

const errors = [];
const steps = [];
let reachedResult = false;
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

async function snap(label) {
    const file = `step-${String(steps.length + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: true });
    const context = await page.evaluate(() => (window.QuizFeedback ? window.QuizFeedback.getContext() : null));
    steps.push({ label, screenshot: file, errors_so_far: errors.length, context });
}

try {
    await page.goto(pageUrl.href, { waitUntil: 'load' });
    await snap('Mở quiz');

    for (let i = 0; i < MAX_STEPS; i++) {
        if (await page.locator(RESULT_SELECTOR).isVisible().catch(() => false)) {
            reachedResult = true;
            break;
        }

        const answers = page.locator(ANSWER_SELECTOR);
        const count = await answers.count();
        if (count === 0) {
            errors.push(`Không tìm thấy đáp án (${ANSWER_SELECTOR}) trên màn hình`);
            await snap('Không có đáp án');
            break;
        }
        await answers.nth(Math.floor(Math.random() * count)).click();
        await page.locator(NEXT_SELECTOR).click();
        await snap(`Sau bước ${i + 1}`);
    }
} catch (err) {
    errors.push(`bot: ${err.message}`);
    await snap('Bot gặp lỗi').catch(() => {});
} finally {
    await browser.close();
}

if (!reachedResult && errors.length === 0) errors.push(`Không tới được màn hình kết quả sau ${MAX_STEPS} bước`);
const finished = errors.length === 0;
const lastContext = steps.map((s) => s.context).filter(Boolean).pop() || {};
const report = {
    tester_code: testerCode,
    url: pageUrl.href,
    created_at: new Date().toISOString(),
    status: finished ? 'ok' : 'issue',
    title: finished ? `[${testerCode}] Chơi hết quiz, không có lỗi` : `[${testerCode}] Phát hiện ${errors.length} lỗi khi chơi quiz`,
    errors,
    steps
};

const markdown = [
    `# ${report.title}`,
    '',
    `- URL: ${report.url}`,
    `- Thời gian: ${report.created_at}`,
    '',
    '## Lỗi',
    ...(errors.length ? errors.map((e) => `- ${e}`) : ['- (không có)']),
    '',
    '## Các bước',
    ...steps.map((s, i) => `${i + 1}. ${s.label} — ![](${s.screenshot})`)
].join('\n');

await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
await writeFile(path.join(outDir, 'report.md'), markdown);
console.log(`${report.title}\n→ ${outDir}`);

// ===== Gửi về NocoBase =====
async function nocobase(action, options) {
    const res = await fetch(`${env.NOCOBASE_URL.replace(/\/$/, '')}/${action}`, {
        ...options,
        headers: { Authorization: `Bearer ${env.NOCOBASE_API_KEY}`, ...options.headers }
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${action} → HTTP ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
    return body.data;
}

async function sendToNocoBase() {
    // 1. Tải ảnh lên file manager → nhận id tệp
    const screenshots = [];
    for (const step of steps) {
        const form = new FormData();
        const bytes = await readFile(path.join(outDir, step.screenshot));
        form.append('file', new Blob([bytes], { type: 'image/png' }), `${stamp}-${testerCode}-${step.screenshot}`);
        const file = await nocobase('attachments:create', { method: 'POST', body: form });
        screenshots.push({ id: file.id });
    }

    // 2. Tạo bản ghi phản hồi, gắn ảnh vào trường đính kèm
    const record = {
        title: report.title,
        source: 'bot',
        status: finished ? 'ok' : 'new',
        tester_code: testerCode,
        game_id: lastContext.game_id || null,
        question_number: lastContext.question_number || null,
        description: markdown,
        errors,
        context: { url: report.url, steps: steps.map(({ label, context }) => ({ label, context })) },
        screenshots
    };
    const collection = env.NOCOBASE_COLLECTION || 'quiz_feedbacks';
    const created = await nocobase(`${collection}:create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    });
    console.log(`→ NocoBase ${collection} #${created.id}`);
}

if (env.NOCOBASE_URL && env.NOCOBASE_API_KEY) {
    try {
        await sendToNocoBase();
    } catch (err) {
        console.error(`Gửi NocoBase thất bại (báo cáo vẫn lưu ở ${outDir}): ${err.message}`);
        process.exit(3);
    }
}

process.exit(finished ? 0 : 2);
