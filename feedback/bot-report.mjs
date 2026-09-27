// Bot kiểm thử: tự chơi quiz, chụp màn hình và tạo "gói phản hồi" chuẩn
// (cùng định dạng ngữ cảnh với widget Userback) để gửi đi hoặc đính kèm issue.
//
// Cài:    npm i -D playwright
// Chạy:   node feedback/bot-report.mjs <url-quiz> [tester-id]
// Ví dụ:  node feedback/bot-report.mjs "file://$PWD/feedback/demo.html" bot-01
//
// Kết quả: feedback-reports/<thời-gian>-<tester>/report.json, report.md, step-*.png

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [url, testerId = 'bot-01'] = process.argv.slice(2);
if (!url) {
    console.error('Cách dùng: node feedback/bot-report.mjs <url-quiz> [tester-id]');
    process.exit(1);
}

const MAX_STEPS = 50;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join('feedback-reports', `${stamp}-${testerId}`);
await mkdir(outDir, { recursive: true });

const pageUrl = new URL(url);
pageUrl.searchParams.set('tester', testerId);

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
        if (await page.locator('#result-section').isVisible().catch(() => false)) {
            reachedResult = true;
            break;
        }

        const answers = page.locator('.answer-btn');
        const count = await answers.count();
        if (count === 0) {
            errors.push('Không tìm thấy đáp án (.answer-btn) trên màn hình');
            await snap('Không có đáp án');
            break;
        }
        await answers.nth(Math.floor(Math.random() * count)).click();
        await page.locator('#next-btn').click();
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
const report = {
    tester_id: testerId,
    url: pageUrl.href,
    created_at: new Date().toISOString(),
    status: finished ? 'ok' : 'issue',
    title: finished ? `[${testerId}] Chơi hết quiz, không có lỗi` : `[${testerId}] Phát hiện ${errors.length} lỗi khi chơi quiz`,
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
process.exit(finished ? 0 : 2);
