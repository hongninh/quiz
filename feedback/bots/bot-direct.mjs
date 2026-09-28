// Bot 1 - feedback DIRECT: tự chơi quiz rồi gửi phản hồi thẳng vào NocoBase qua API
// (tải ảnh bằng attachments:create, tạo bản ghi trong bảng phản hồi).
//
// Chạy:  NOCOBASE_URL=https://nocobase.cua-ban.vn/api NOCOBASE_API_KEY=xxx \
//        node feedback/bots/bot-direct.mjs <url-quiz> [tester-code]
//
//   NOCOBASE_URL          có /api ở cuối; bỏ trống = chỉ lưu báo cáo cục bộ
//   NOCOBASE_API_KEY      Settings > API keys (role chỉ cần quyền tạo phản hồi + tải tệp)
//   NOCOBASE_COLLECTION   mặc định quiz_feedbacks
//
// Exit code: 0 không lỗi · 2 quiz có lỗi · 3 gửi NocoBase thất bại

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, playQuiz, buildReport } from './lib.mjs';

const env = process.env;
const { url, testerCode } = parseArgs('bot-direct');
const session = await playQuiz({ botName: 'bot-direct', url, testerCode });
await session.browser.close();
const report = await buildReport(session);
console.log(`${report.title}\n→ ${session.outDir}`);

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
    for (const step of session.steps) {
        const form = new FormData();
        const bytes = await readFile(path.join(session.outDir, step.screenshot));
        form.append('file', new Blob([bytes], { type: 'image/png' }), `${session.stamp}-${testerCode}-${step.screenshot}`);
        const file = await nocobase('attachments:create', { method: 'POST', body: form });
        screenshots.push({ id: file.id });
    }

    // 2. Tạo bản ghi phản hồi, gắn ảnh vào trường đính kèm
    const record = {
        title: report.title,
        source: 'bot-direct',
        status: report.ok ? 'ok' : 'new',
        tester_code: testerCode,
        game_id: report.context.game_id || null,
        question_number: report.context.question_number || null,
        description: report.markdown,
        errors: report.errors,
        context: { url: report.url, steps: report.steps.map(({ label, context }) => ({ label, context })) },
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
        console.error(`Gửi NocoBase thất bại (báo cáo vẫn lưu ở ${session.outDir}): ${err.message}`);
        process.exit(3);
    }
}

process.exit(report.ok ? 0 : 2);
