# Cài cache + gzip cho quiz trên máy chủ nginx (Ubuntu 24.04, nginx 1.24). Chạy bằng root.
# Có sao lưu; nếu nginx -t báo lỗi thì tự khôi phục, trang không bị ảnh hưởng.
NGAY=$(date +%Y%m%d-%H%M)
cp /etc/nginx/nginx.conf /root/nginx.conf.bak-$NGAY
cp /etc/nginx/snippets/shdn-ten-mien-nocobase.conf /root/shdn-ten-mien-nocobase.conf.bak-$NGAY

# 2000 điện thoại x vài kết nối mỗi máy: 768 kết nối/tiến trình là không đủ
sed -i 's/worker_connections 768;/worker_connections 4096;/' /etc/nginx/nginx.conf
grep -q worker_rlimit_nofile /etc/nginx/nginx.conf || sed -i 's/^worker_processes auto;/worker_processes auto;\nworker_rlimit_nofile 20000;/' /etc/nginx/nginx.conf

mkdir -p /var/lib/nginx/quiz-cache && chown www-data:www-data /var/lib/nginx/quiz-cache

cat > /etc/nginx/conf.d/quiz-cache.conf <<'CAUHINH'
# /etc/nginx/conf.d/quiz-cache.conf — nằm trong khối http { } (nginx.conf đã include conf.d/*.conf)
# Nén JS/JSON (trước đây chỉ nén HTML: app.js 244 KB đi nguyên) + vùng cache ngắn cho quiz.
gzip_types text/css text/plain application/javascript application/json image/svg+xml;
gzip_proxied any;
gzip_vary on;
gzip_min_length 1024;

proxy_cache_path /var/lib/nginx/quiz-cache levels=1:2 keys_zone=quiz:10m max_size=200m inactive=30m use_temp_path=off;
CAUHINH

cat > /etc/nginx/snippets/quiz-cache-locations.conf <<'CAUHINH'
# /etc/nginx/snippets/quiz-cache-locations.conf — include ở dòng đầu snippets/shdn-ten-mien-nocobase.conf
# Tài nguyên giống hệt nhau với mọi học sinh: nginx giữ bản sao vài chục giây, NocoBase chỉ dựng lại
# 1 lần/chu kỳ thay vì 1 lần/học sinh. Đo 2026-10-09: tải đề chỉ ~16 lượt/giây vì NocoBase chạy 1 tiến trình.
# "location =" khớp chính xác nên được ưu tiên hơn các location regex sẵn có, không phải sửa chúng.

# Đề thi (frozen_content). Sửa đề thì học sinh thấy bản mới sau tối đa 30 giây.
location = /api/shdnQuiz:goi {
    proxy_pass http://127.0.0.1:13000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Accept-Encoding "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;

    proxy_cache quiz;
    proxy_cache_key $scheme$host$request_uri;
    proxy_cache_valid 200 30s;
    proxy_cache_lock on;
    proxy_cache_lock_timeout 10s;
    proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_ignore_headers Cache-Control Expires Set-Cookie;
    proxy_hide_header Set-Cookie;
    add_header X-Cache $upstream_cache_status always;
}

# Mã nguồn trang làm bài (link có ?v=<phiên bản> nên đổi bản là đổi khoá cache).
location = /q/app.js {
    rewrite ^ /api/shdnQuiz:tep?ten=app.js break;
    proxy_pass http://127.0.0.1:13000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Accept-Encoding "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;

    proxy_cache quiz;
    proxy_cache_key $scheme$host$request_uri;
    proxy_cache_valid 200 60s;
    proxy_cache_lock on;
    proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_ignore_headers Cache-Control Expires Set-Cookie;
    proxy_hide_header Set-Cookie;
    add_header X-Cache $upstream_cache_status always;
}

# Script nút góp ý (máy chủ vốn đã cho phép cache 60 giây).
location = /api/shdnFeedback:ma.js {
    proxy_pass http://127.0.0.1:13000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Accept-Encoding "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;

    proxy_cache quiz;
    proxy_cache_key $scheme$host$request_uri;
    proxy_cache_valid 200 60s;
    proxy_cache_lock on;
    proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504;
    proxy_ignore_headers Cache-Control Expires Set-Cookie;
    proxy_hide_header Set-Cookie;
    add_header X-Cache $upstream_cache_status always;
}
CAUHINH

grep -q quiz-cache-locations /etc/nginx/snippets/shdn-ten-mien-nocobase.conf || sed -i '1i include snippets/quiz-cache-locations.conf;' /etc/nginx/snippets/shdn-ten-mien-nocobase.conf

if nginx -t; then
    systemctl reload nginx && echo "=== XONG: da bat cache + gzip ==="
else
    echo "=== LOI CAU HINH: dang khoi phuc ban cu ==="
    cp /root/nginx.conf.bak-$NGAY /etc/nginx/nginx.conf
    cp /root/shdn-ten-mien-nocobase.conf.bak-$NGAY /etc/nginx/snippets/shdn-ten-mien-nocobase.conf
    rm -f /etc/nginx/conf.d/quiz-cache.conf /etc/nginx/snippets/quiz-cache-locations.conf
    nginx -t && echo "=== Da khoi phuc, trang van chay nhu cu ==="
fi
