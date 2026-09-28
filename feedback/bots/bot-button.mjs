// Bot 2 - feedback QUA NÚT GÓP Ý: tự chơi quiz, rồi bấm nút "Góp ý" ở góc phải màn hình,
// điền mô tả, đính kèm ảnh chụp và bấm Gửi - đi đúng đường của người dùng thật,
// nên kiểm thử luôn cả tool feedback nội bộ.
//
// Chạy:  node feedback/bots/bot-button.mjs <url-quiz> [tester-code]
//
// Bot tự dò nút góp ý (chữ / aria-label / title khớp FEEDBACK_BUTTON_TEXT, chọn cái nằm góc phải-dưới nhất).
// Nếu tool nội bộ khác mặc định, khai báo selector:
//   FEEDBACK_BUTTON_SELECTOR       nút mở góp ý
//   FEEDBACK_BUTTON_TEXT           mặc định: góp ý|feedback|phản hồi|báo lỗi
//   FEEDBACK_TEXT_SELECTOR         ô mô tả (mặc định: textarea / contenteditable đang hiện)
//   FEEDBACK_FILE_SELECTOR         ô chọn tệp để đính ảnh (mặc định: input[type=file])
//   FEEDBACK_SCREENSHOT_SELECTOR   nút "chụp màn hình" của tool (nếu có thì bấm nút này thay vì đính tệp)
//   FEEDBACK_SUBMIT_SELECTOR       nút gửi (mặc định: nút có chữ gửi|submit|send)
//   FEEDBACK_SUCCESS_TEXT          chữ báo thành công (mặc định: cảm ơn|thành công|đã gửi|thank)
//
// Exit code: 0 không lỗi · 2 quiz có lỗi (đã gửi góp ý) · 4 không gửi được qua nút góp ý

import { parseArgs, playQuiz, snap, buildReport } from './lib.mjs';

const env = process.env;
const TIMEOUT = 10000;
const toRegex = (text) => new RegExp(text, 'i');
const BUTTON_TEXT = toRegex(env.FEEDBACK_BUTTON_TEXT || 'góp ý|feedback|phản hồi|báo lỗi');
const SUBMIT_TEXT = /gửi|submit|send/i;
const SUCCESS_TEXT = toRegex(env.FEEDBACK_SUCCESS_TEXT || 'cảm ơn|thành công|đã gửi|thank');

const { url, testerCode } = parseArgs('bot-button');
const session = await playQuiz({ botName: 'bot-button', url, testerCode });
const { page } = session;

// Nút góp ý nằm góc phải-dưới nhất trong các phần tử khớp chữ
async function findFeedbackButton() {
    if (env.FEEDBACK_BUTTON_SELECTOR) return page.locator(env.FEEDBACK_BUTTON_SELECTOR).first();

    const found = await page.evaluate((source) => {
        const pattern = new RegExp(source, 'i');
        let best = null;
        let bestScore = -Infinity;
        document.querySelectorAll('button, a, [role="button"], [aria-label], [title]').forEach((el) => {
            const label = [el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')].join(' ');
            const rect = el.getBoundingClientRect();
            if (!pattern.test(label) || rect.width === 0 || rect.height === 0) return;
            const score = rect.right + rect.bottom;
            if (score > bestScore) {
                best = el;
                bestScore = score;
            }
        });
        if (!best) return false;
        best.setAttribute('data-bot-feedback-target', '');
        return true;
    }, BUTTON_TEXT.source);

    if (!found) throw new Error(`Không thấy nút góp ý (chữ khớp /${BUTTON_TEXT.source}/)`);
    return page.locator('[data-bot-feedback-target]');
}

async function findTextField() {
    const selector = env.FEEDBACK_TEXT_SELECTOR || 'textarea:visible, [contenteditable="true"]:visible';
    const field = page.locator(selector).last();
    await field.waitFor({ state: 'visible', timeout: TIMEOUT });
    return field;
}

async function attachScreenshot(screenshotPath) {
    if (env.FEEDBACK_SCREENSHOT_SELECTOR) {
        await page.locator(env.FEEDBACK_SCREENSHOT_SELECTOR).first().click();
        return 'bấm nút chụp màn hình của tool';
    }
    const fileInput = page.locator(env.FEEDBACK_FILE_SELECTOR || 'input[type="file"]');
    if (await fileInput.count() === 0) return 'tool không có ô đính tệp - bỏ qua ảnh';
    await fileInput.last().setInputFiles(screenshotPath);
    return 'đính kèm tệp ảnh';
}

async function submitForm() {
    const submit = env.FEEDBACK_SUBMIT_SELECTOR
        ? page.locator(env.FEEDBACK_SUBMIT_SELECTOR).first()
        : page.getByRole('button', { name: SUBMIT_TEXT }).last();
    await submit.click({ timeout: TIMEOUT });
    await page.getByText(SUCCESS_TEXT).first().waitFor({ state: 'visible', timeout: TIMEOUT });
}

function describe() {
    const last = session.steps.map((s) => s.context).filter(Boolean).pop() || {};
    const lines = [
        `[${testerCode}] ${session.errors.length ? `Phát hiện ${session.errors.length} lỗi khi chơi quiz` : 'Chơi hết quiz, không có lỗi'}`,
        `Game: ${last.game_id || '?'} · câu ${last.question_number || '?'}/${last.total_questions || '?'}`,
        ...session.errors.map((e) => `- ${e}`)
    ];
    return lines.join('\n').slice(0, 2000);
}

let submitted = false;
const quizErrorCount = session.errors.length;
try {
    const screenshotPath = await snap(session, 'Trước khi mở góp ý');
    await (await findFeedbackButton()).click();

    const field = await findTextField();
    await field.fill(describe());
    const attachNote = await attachScreenshot(screenshotPath);
    await snap(session, `Form góp ý đã điền (${attachNote})`);

    await submitForm();
    submitted = true;
    await snap(session, 'Đã gửi góp ý');
} catch (err) {
    session.errors.push(`nút góp ý: ${err.message.split('\n')[0]}`);
    await snap(session, 'Không gửi được góp ý').catch(() => {});
} finally {
    await session.browser.close();
}

const report = await buildReport(session);
console.log(`${report.title}\n${submitted ? '→ Đã gửi qua nút góp ý' : '→ KHÔNG gửi được qua nút góp ý'}\n→ ${session.outDir}`);

if (!submitted) process.exit(4);
process.exit(quizErrorCount === 0 && report.ok ? 0 : 2);
