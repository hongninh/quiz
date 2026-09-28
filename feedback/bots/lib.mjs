// Phần dùng chung cho 2 bot: mở quiz, tự chơi, chụp màn hình từng bước, ghi lỗi console,
// đọc ngữ cảnh quiz từ thuộc tính data-quiz-* và lưu báo cáo cục bộ.
//
// Biến môi trường dùng chung:
//   ANSWER_SELECTOR=[data-quiz-answer]  NEXT_SELECTOR=[data-quiz-next]  RESULT_SELECTOR=[data-quiz-result]
//   STORAGE_STATE=auth.json   (phiên đăng nhập NocoBase, tạo bằng: npx playwright codegen --save-storage=auth.json <url>)

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const env = process.env;
const ANSWER_SELECTOR = env.ANSWER_SELECTOR || '[data-quiz-answer]';
const NEXT_SELECTOR = env.NEXT_SELECTOR || '[data-quiz-next]';
const RESULT_SELECTOR = env.RESULT_SELECTOR || '[data-quiz-result]';
const MAX_STEPS = 50;

export function parseArgs(botName) {
    const [url, testerCode = 'bot-01'] = process.argv.slice(2);
    if (!url) {
        console.error(`Cách dùng: node feedback/bots/${botName}.mjs <url-quiz> [tester-code]`);
        process.exit(1);
    }
    return { url, testerCode };
}

// Đọc ngữ cảnh quiz ngay trong trang (không phụ thuộc widget nào)
function readQuizContext() {
    const read = (attr) => {
        const el = document.querySelector('[' + attr + ']');
        if (!el) return null;
        return el.getAttribute(attr) || el.textContent.trim() || null;
    };
    return {
        page_url: location.href,
        game_id: read('data-quiz-game-id'),
        question_number: read('data-quiz-question-number'),
        total_questions: read('data-quiz-total'),
        question_text: read('data-quiz-question-text'),
        viewport: innerWidth + 'x' + innerHeight
    };
}

// Mở quiz và tự chơi đến màn hình kết quả. Trả về session còn mở để bot làm tiếp.
export async function playQuiz({ botName, url, testerCode }) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outDir = path.join('feedback-reports', `${stamp}-${botName}-${testerCode}`);
    await mkdir(outDir, { recursive: true });

    const pageUrl = new URL(url);
    pageUrl.searchParams.set('tester', testerCode);

    const browser = await chromium.launch();
    const context = await browser.newContext(env.STORAGE_STATE ? { storageState: env.STORAGE_STATE } : {});
    const page = await context.newPage();
    const session = { botName, testerCode, stamp, outDir, url: pageUrl.href, browser, page, errors: [], steps: [], reachedResult: false };

    page.on('pageerror', (err) => session.errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => { if (msg.type() === 'error') session.errors.push(`console: ${msg.text()}`); });

    try {
        await page.goto(pageUrl.href, { waitUntil: 'load' });
        await snap(session, 'Mở quiz');

        for (let i = 0; i < MAX_STEPS; i++) {
            if (await page.locator(RESULT_SELECTOR).isVisible().catch(() => false)) {
                session.reachedResult = true;
                break;
            }
            const answers = page.locator(ANSWER_SELECTOR);
            const count = await answers.count();
            if (count === 0) {
                session.errors.push(`Không tìm thấy đáp án (${ANSWER_SELECTOR}) trên màn hình`);
                await snap(session, 'Không có đáp án');
                break;
            }
            await answers.nth(Math.floor(Math.random() * count)).click();
            await page.locator(NEXT_SELECTOR).click();
            await snap(session, `Sau bước ${i + 1}`);
        }
    } catch (err) {
        session.errors.push(`bot: ${err.message}`);
        await snap(session, 'Bot gặp lỗi').catch(() => {});
    }

    if (!session.reachedResult && session.errors.length === 0) {
        session.errors.push(`Không tới được màn hình kết quả sau ${MAX_STEPS} bước`);
    }
    return session;
}

export async function snap(session, label) {
    const file = `step-${String(session.steps.length + 1).padStart(2, '0')}.png`;
    await session.page.screenshot({ path: path.join(session.outDir, file), fullPage: true });
    const context = await session.page.evaluate(readQuizContext).catch(() => null);
    session.steps.push({ label, screenshot: file, errors_so_far: session.errors.length, context });
    return path.join(session.outDir, file);
}

// Báo cáo chuẩn (dùng cho cả 2 bot) + lưu report.json / report.md
export async function buildReport(session) {
    const { botName, testerCode, errors, steps } = session;
    const ok = errors.length === 0;
    const lastContext = steps.map((s) => s.context).filter(Boolean).pop() || {};
    const title = ok
        ? `[${testerCode}] Chơi hết quiz, không có lỗi`
        : `[${testerCode}] Phát hiện ${errors.length} lỗi`;

    const markdown = [
        `# ${title}`,
        '',
        `- Bot: ${botName} (${testerCode})`,
        `- URL: ${session.url}`,
        `- Game: ${lastContext.game_id || '?'} · câu ${lastContext.question_number || '?'}/${lastContext.total_questions || '?'}`,
        `- Thời gian: ${new Date().toISOString()}`,
        '',
        '## Lỗi',
        ...(errors.length ? errors.map((e) => `- ${e}`) : ['- (không có)']),
        '',
        '## Các bước',
        ...steps.map((s, i) => `${i + 1}. ${s.label} — ${s.screenshot}`)
    ].join('\n');

    const report = { bot: botName, tester_code: testerCode, url: session.url, ok, title, errors, steps, context: lastContext, markdown };
    await writeFile(path.join(session.outDir, 'report.json'), JSON.stringify(report, null, 2));
    await writeFile(path.join(session.outDir, 'report.md'), markdown);
    return report;
}
