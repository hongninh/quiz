# Cache + gzip cho trang quiz (nginx)

> Bản chính đã chuyển sang `hongninh/shdn-nocobase` → `plugins_nguon/_ha_tang/nginx_quiz_cache/` (có `cai_dat.sh` chạy thẳng trên VPS).
> Bản ở đây giữ để tra; từ 2026-10-10 có thêm cache vỏ trang `/q/<mã>` 10 giây.

NocoBase (`nocobase/nocobase:2.2.4`, Docker) chạy 1 tiến trình Node nên mỗi giây chỉ dựng được
khoảng 16 gói đề. Các file ở đây để nginx giữ bản sao ngắn hạn của những thứ giống hệt nhau với
mọi học sinh, gồm đề (`shdnQuiz:goi`, 30 giây), `app.js` (60 giây) và `ma.js` (60 giây). Kèm theo
đó là nén JS/JSON và tăng `worker_connections` từ 768 lên 4096.

- `quiz-cache.conf` → `/etc/nginx/conf.d/`
- `quiz-cache-locations.conf` → `/etc/nginx/snippets/`, được include ở dòng đầu `shdn-ten-mien-nocobase.conf`
- `cai-dat.sh`: dán vào SSH (root) để cài cả hai. Script sao lưu vào `/root/*.bak-<ngày>`, và nếu `nginx -t` lỗi thì tự khôi phục.

Kiểm tra: gọi `curl -sI 'https://ca.giaothongantoan.vn/api/shdnQuiz:goi?ma=LT100010' | grep -i x-cache` hai lần,
lần 2 phải ra `HIT`. Sửa đề thì học sinh thấy bản mới sau tối đa 30 giây.

Gỡ bỏ:

```bash
sed -i '/quiz-cache-locations/d' /etc/nginx/snippets/shdn-ten-mien-nocobase.conf
rm /etc/nginx/conf.d/quiz-cache.conf /etc/nginx/snippets/quiz-cache-locations.conf
nginx -t && systemctl reload nginx
```
