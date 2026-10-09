// Mô phỏng nhiều học sinh mở cùng một link quiz CÙNG LÚC và đo máy chủ chịu được tới đâu.
//
// Mỗi "học sinh" dùng kết nối riêng (giống 1 điện thoại) và tải đúng những gì trình duyệt tải
// lúc mở bài: trang /q/<mã>, app.js, ma.js, /api/shdnQuiz:goi. Bật --nop để thử thêm lúc nộp bài.
//
// Cách dùng:
//   npm i -D undici
//   node loadtest/tai-dong-thoi.mjs <link-quiz> 25 50 100 200          # chỉ đọc, không ghi gì
//   node loadtest/tai-dong-thoi.mjs <link-quiz> 50 --nop                 # thêm nộp bài (GHI bản ghi thật)
//
// --nop gửi bài nộp mẫu với attempt_code bắt đầu bằng "LTEST" và tên "TEST TAI - ..." để dễ lọc xoá.
// Bài nộp mẫu lấy từ một lần chơi thật: chạy bot hoặc copy thân request /api/shdnQuiz:nop vào
// loadtest/nop-mau.json (biến NOP_MAU để đổi đường dẫn).
//
// Đọc kết quả: p95 là thời gian mà 95% yêu cầu xong trước. app.js tự bỏ cuộc khi tải đề quá 9 giây
// (bản type=online sẽ báo "Chưa tải được đề") và khi nộp bài quá 25 giây (tự gửi lại sau).

import { Agent, ProxyAgent, request } from 'undici';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const link = args.find((a) => a.startsWith('http'));
const levels = args.filter((a) => /^\d+$/.test(a)).map(Number);
const coNop = args.includes('--nop');
if (!link || levels.length === 0) {
    console.error('Cách dùng: node loadtest/tai-dong-thoi.mjs <link-quiz> <số học sinh> [...] [--nop]');
    process.exit(1);
}

const url = new URL(link);
const ma = url.pathname.split('/').pop();
const goc = url.origin;
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const ketNoi = () => (proxy ? new ProxyAgent({ uri: proxy, connections: 6 }) : new Agent({ connections: 6 }));

async function layAppJs() {
    const r = await request(link, { dispatcher: ketNoi() });
    const html = await r.body.text();
    return (html.match(/src="(\/q\/app\.js[^"]*)"/) || [])[1] || '/q/app.js';
}
const duongDan = [url.pathname + url.search, await layAppJs(), '/api/shdnFeedback:ma.js', '/api/shdnQuiz:goi?ma=' + ma];

let nopMau = null;
if (coNop) {
    const tep = process.env.NOP_MAU || new URL('./nop-mau.json', import.meta.url);
    nopMau = JSON.parse(readFileSync(tep, 'utf8'));
}

const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))];
const giay = (ms) => (ms / 1000).toFixed(2) + 's';

async function goi(d, ten, thoiGian, ma, p, tuyChon = {}) {
    const t = performance.now();
    let kq;
    try {
        const r = await request(goc + p, { dispatcher: d, headersTimeout: 120000, bodyTimeout: 120000, ...tuyChon });
        const chu = await r.body.text();
        kq = r.statusCode === 200 && (!tuyChon.method || chu.includes('"ok":true')) ? '200' : String(r.statusCode);
    } catch (e) {
        kq = e.code || 'LOI';
    }
    (thoiGian[ten] ||= []).push(performance.now() - t);
    ma[kq] = (ma[kq] || 0) + 1;
}

const nhan = Date.now().toString(36);
for (const n of levels) {
    const thoiGian = {};
    const ma = {};
    const t0 = performance.now();
    await Promise.all(Array.from({ length: n }, async (_, i) => {
        const d = ketNoi();
        await Promise.all(duongDan.map((p) => goi(d, p.split('?')[0], thoiGian, ma, p, { headers: { 'accept-encoding': 'gzip' } })));
        if (nopMau) {
            const than = structuredClone(nopMau);
            Object.assign(than.attempt, {
                attempt_code: `LTEST${nhan}${n}x${i}`, player_uid: `UTEST${i}`, session_id: `STEST${i}`,
                player_full_name: `TEST TAI - ${nhan} - ${i}`
            });
            await goi(d, '/api/shdnQuiz:nop', thoiGian, ma, '/api/shdnQuiz:nop', {
                method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(than)
            });
        }
        await d.close();
    }));
    console.log(`\n== ${n} học sinh cùng lúc — xong sau ${giay(performance.now() - t0)} — kết quả:`, ma);
    for (const [ten, a] of Object.entries(thoiGian)) {
        const canhBao = (ten.includes(':goi') && pct(a, 0.95) > 9000) || (ten.includes(':nop') && pct(a, 0.95) > 25000) ? '  ⚠ quá hạn chờ của app.js' : '';
        console.log(`  ${ten.padEnd(26)} p50=${giay(pct(a, 0.5))} p95=${giay(pct(a, 0.95))} max=${giay(Math.max(...a))}${canhBao}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
}
if (nopMau) console.log(`\nĐã tạo bản ghi thử: attempt_code bắt đầu bằng LTEST${nhan} — nhớ xoá sau khi test.`);
