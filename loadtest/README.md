# Test tải: nhiều học sinh làm bài cùng lúc

```bash
npm i -D undici
node loadtest/tai-dong-thoi.mjs "https://ca.giaothongantoan.vn/q/LT100010?type=online" 25 50 100 200
node loadtest/tai-dong-thoi.mjs "https://ca.giaothongantoan.vn/q/LT100010" 50 --nop   # có ghi bản ghi LTEST… / "TEST TAI"
```

Nên chạy giờ vắng, tăng dần từng mức, thấy lỗi thì dừng. Bản ghi thử của `--nop` lọc theo
`attempt_code` bắt đầu bằng `LTEST` hoặc tên `TEST TAI` rồi xoá.

## Số đo ngày 2026-10-09 (LT100010, app.js 0.7.6)

| Đường dẫn | 1 người | 100 cùng lúc | 200 cùng lúc | Ghi chú |
|---|---|---|---|---|
| `/q/LT100010`, `icon.svg`, ảnh `/storage/uploads` | ~1s | p95 ~2s | | ổn |
| `/q/app.js` (244 KB, **chưa nén gzip**) | ~1,1s | p95 ~2,9s | | |
| `/api/shdnQuiz:goi` (tải đề, 50 KB, `no-store`) | ~0,3s | p95 **7s** | p95 **12s** | **nút thắt**, ≈ 16 yêu cầu/giây |
| `/api/shdnQuiz:nop` (nộp bài 30 câu) | ~0,6s | 50 cùng lúc: p95 **9s** | | ≈ 5–6 bài/giây |

app.js bỏ cuộc khi tải đề quá **9 giây**. Ở bản `type=online`, học sinh sẽ thấy "Chưa tải được đề".
Nộp bài thì quá 25 giây mới bỏ cuộc, sau đó tự gửi lại theo các mốc 5s, 15s, 60s, 300s (bài đã lưu
trong IndexedDB nên không mất).
