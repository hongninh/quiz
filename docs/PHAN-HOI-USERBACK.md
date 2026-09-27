# 🐞 Phản hồi kiểm thử quiz qua Userback

Tài liệu này ghi lại **cách phản hồi trước đây**, **giải pháp dùng Userback** (chụp màn hình + mô tả),
và **ưu / nhược điểm** để quyết định.

---

## 1. Cách phản hồi trước đây

### 1.1 Quy trình

Theo lịch sử repo (các nhánh `cursor/*` và các file `DEBUG-*`, `FIX-*`, `TROUBLESHOOTING.md`), vòng phản hồi trước đây là:

```
Tester / bot mở quiz (ProcFu hoặc file HTML)
        │  chơi thử
        ▼
Gặp lỗi → mở F12 Console → copy log
(vd: "Quiz data loaded: undefined", "📊 KẾT QUẢ QUIZ: { quiz_results: [] }")
        │  dán log + mô tả bằng lời vào chat
        ▼
AI agent (Cursor Agent) đọc → tạo nhánh cursor/... → sửa code
        │
        ▼
Sinh thêm tài liệu: DEBUG-CHECKLIST.md, FIX-ENGINE-ERROR.md,
TROUBLESHOOTING.md, SIMPLE-DEBUG.html, QUICK-TEST.html ...
```

### 1.2 Nguyên lý

- Phản hồi là **văn bản + log console dán tay**.
- Ngữ cảnh (đang ở câu nào, dữ liệu game nào, trình duyệt gì, màn hình ra sao) **phụ thuộc hoàn toàn vào người báo** có ghi đủ hay không.
- Mỗi lần sửa lại tạo thêm file hướng dẫn debug để tester tự kiểm tra (chạy lệnh `console.log(...)` trong F12).

### 1.3 Hạn chế đã gặp

| Vấn đề | Hệ quả |
|---|---|
| Không có ảnh chụp màn hình | Lỗi giao diện (kéo thả, hotspot, ảnh lệch) rất khó mô tả bằng lời |
| Log phải copy tay | Hay thiếu log quan trọng, hoặc copy sai đoạn |
| Không biết đang ở câu nào / game id nào | Dev phải hỏi lại, mất một vòng |
| Phản hồi nằm rải rác trong chat | Không theo dõi được trạng thái: mới / đang sửa / đã xong |
| Mỗi lần sửa sinh thêm file `.md` / `.html` debug | Repo đầy file tạm, khó biết file nào còn đúng |

---

## 2. Giải pháp: Userback

Userback là công cụ phản hồi trực quan: nhúng 1 widget vào trang, người kiểm thử bấm nút →
**chụp màn hình, vẽ/khoanh vùng lỗi, gõ mô tả** → gửi. Userback tự đính kèm URL, trình duyệt,
kích thước màn hình, log console, và **dữ liệu tuỳ chỉnh** mà ta truyền vào.

### 2.1 Kiến trúc đề xuất (kết hợp)

```
TESTER NGƯỜI
  Quiz + widget Userback (feedback/userback-feedback.js)
    │  chụp màn hình + khoanh vùng + mô tả
    │  tự gắn: game_id, câu số mấy, nội dung câu, lỗi JS gần nhất, tester_id, trình duyệt
    ▼
  Userback dashboard ──► GitHub / Jira / Slack (tuỳ gói)
    ▲
    │  Cách A: REST API (chỉ gói Business Plus)
    │
BOT TỰ ĐỘNG
  feedback/bot-report.mjs: tự chơi quiz, chụp từng bước, ghi lỗi console
    │
    └─► Cách B: report.md + ảnh PNG → GitHub Issue / tải lên tay
```

**Điểm quan trọng về bot:** widget Userback là giao diện **cho người**. Bot (Playwright, AI agent…)
có thể điều khiển trình duyệt nhưng việc bấm và điền form widget rất dễ gãy khi Userback đổi giao diện.
Vì vậy bot nên:

- **Cách A – REST API Userback** (`POST https://rest.userback.io/1.0/feedback`): bot gửi thẳng phản hồi vào
  cùng dashboard với người. Cần gói **Business Plus** (gói cao nhất) mới có REST API / webhook.
- **Cách B – Gói phản hồi của bot** (đã làm sẵn `feedback/bot-report.mjs`): bot tự chơi, chụp ảnh mỗi bước,
  ghi lỗi console, xuất `report.md` + `report.json` + ảnh PNG. Đính kèm vào GitHub Issue hoặc tải lên Userback.
  Không tốn phí, dùng được ngay.
- Cách C – Bot bấm widget Userback: **không khuyến nghị**.

### 2.2 Các file đã thêm

| File | Vai trò |
|---|---|
| `feedback/userback-feedback.js` | Tải widget Userback, gắn ngữ cảnh quiz, ghi lại 20 lỗi JS gần nhất, nhận diện tester |
| `feedback/demo.html` | Trang quiz mẫu có nút “🐞 Báo lỗi / Góp ý” để thử |
| `feedback/bot-report.mjs` | Bot tự chơi quiz → ảnh chụp + báo cáo chuẩn |

### 2.3 Cài đặt cho tester (người)

1. Tạo tài khoản Userback → tạo **Project** cho quiz.
2. Trong project, thêm **domain** nơi quiz chạy (vd domain ProcFu, `cdn.jsdelivr.net` nếu mở trực tiếp).
   Widget sẽ **không hiện** nếu domain chưa được thêm.
3. Lấy **Access Token** (Settings → Install / Widget code).
4. Thêm 2 thẻ script **ngay trong trang có quiz** (vd cuối `procfu.html`):

```html
<script>
    window.QUIZ_FEEDBACK = {
        accessToken: 'USERBACK_ACCESS_TOKEN',
        onlyForTesters: true,   // học viên thật không thấy nút
        hideLauncher: false     // true nếu muốn tự làm nút tiếng Việt, gọi QuizFeedback.open()
    };
</script>
<script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@main/feedback/userback-feedback.js"></script>
```

5. Gửi cho mỗi tester một link riêng có `?tester=<ma-tester>`, ví dụ `...?tester=bot-01`, `...?tester=chi-lan`.
   Mã tester được nhớ trong trình duyệt, lần sau không cần gõ lại. Trong Userback mỗi phản hồi hiện rõ ai gửi.

6. Tester gặp lỗi → bấm nút Userback (hoặc nút “🐞 Báo lỗi”) → chụp màn hình → khoanh vùng → gõ mô tả → Gửi.

Dữ liệu tự đính kèm mỗi phản hồi (trong mục *Custom data* của Userback):

```json
{
  "page_url": "...?tester=chi-lan",
  "game_id": "demo-001",
  "game_title": "Quiz demo Userback",
  "question_number": "2",
  "total_questions": "2",
  "question_text": "HTML là viết tắt của gì?",
  "viewport": "1280x720",
  "tester_id": "chi-lan",
  "recent_errors": [{ "time": "...", "message": "Uncaught TypeError ..." }]
}
```

Muốn thêm dữ liệu riêng (vd đáp án đã chọn), truyền `getContext`:

```js
window.QUIZ_FEEDBACK = {
    accessToken: '...',
    getContext: () => ({ selected_answers: window.quizGame && window.quizGame.answers })
};
```

### 2.4 Chạy bot kiểm thử

```bash
npm i -D playwright
node feedback/bot-report.mjs "https://<link-quiz>" bot-01
# → feedback-reports/<thời-gian>-bot-01/report.md, report.json, step-01.png ...
# exit code 0 = chơi hết không lỗi, 2 = có lỗi
```

Bot tìm `.answer-btn` và `#next-btn` (giống `CDN Quiz/procfu.html`), chọn ngẫu nhiên đến khi hiện `#result-section`.
Với các màn khác (kéo thả, hotspot…) cần bổ sung thao tác tương ứng trong vòng lặp.

---

## 3. Ưu / nhược điểm khi dùng Userback

### ✅ Ưu điểm

| Ưu điểm | Chi tiết |
|---|---|
| **Có ảnh chụp + khoanh vùng** | Lỗi giao diện nhìn là hiểu, không cần mô tả dài |
| **Tự đính kèm ngữ cảnh** | URL, trình duyệt, màn hình, log console, câu đang làm, game id → dev không phải hỏi lại |
| **Tester không cần biết F12** | Không còn bước “mở Console, copy log” |
| **Một nơi tập trung** | Dashboard có trạng thái, gán người xử lý, lọc theo tester / loại lỗi |
| **Quay video màn hình** | Hữu ích cho lỗi thao tác (kéo thả, thứ tự) |
| **Tích hợp** | Đẩy sang GitHub Issues / Jira / Slack (tuỳ gói) |
| **Gói Free** | Theo thông tin công khai: không giới hạn số phản hồi và số người dùng — đủ để thử nghiệm |
| **Nhúng nhẹ** | 2 thẻ script, không sửa logic quiz |

### ❌ Nhược điểm

| Nhược điểm | Chi tiết / cách giảm |
|---|---|
| **Bot không dùng widget tốt** | Widget là cho người. Bot dùng REST API (gói cao nhất) hoặc `bot-report.mjs` |
| **REST API / webhook đắt** | Chỉ có ở gói Business Plus (~159–199 USD/tháng theo các nguồn công khai 2026 — kiểm tra lại giá thực tế) |
| **Phụ thuộc dịch vụ ngoài** | Userback lỗi / chặn mạng → không gửi được. Dữ liệu (kể cả ảnh chụp) lưu trên server Userback |
| **Ảnh chụp phía trình duyệt không hoàn hảo** | Chụp bằng cách dựng lại DOM: iframe khác domain, `<canvas>`, video, ảnh không có CORS có thể bị trắng / lệch. Tester có thể chọn chụp bằng tiện ích trình duyệt của Userback cho ảnh chính xác |
| **Phải nhúng trong đúng trang** | Nếu quiz nằm trong iframe (ProcFu/Podio), widget phải nằm **bên trong** iframe đó và domain iframe phải được thêm vào project |
| **Quyền riêng tư** | Ảnh chụp có thể chứa tên / đáp án học viên. Dùng `onlyForTesters: true` để học viên thật không thấy widget |
| **Thêm 1 script bên thứ ba** | Tăng thời gian tải; bị một số trình chặn quảng cáo chặn |
| **Cache jsDelivr** | Sửa `userback-feedback.js` trên `@main` có thể mất vài giờ mới cập nhật; dùng `@<commit>` hoặc purge cache |

### 📊 So sánh nhanh

| Tiêu chí | Cách cũ (log + chat) | Userback |
|---|---|---|
| Ảnh chụp màn hình | ❌ | ✅ có khoanh vùng |
| Ngữ cảnh tự động | ❌ | ✅ |
| Tester cần biết kỹ thuật | Có (F12) | Không |
| Theo dõi trạng thái lỗi | ❌ | ✅ |
| Bot gửi phản hồi | ✅ dễ (text) | ⚠️ cần REST API (đắt) hoặc gói phản hồi riêng |
| Chi phí | 0 | 0 (Free) → cao nếu cần API |
| Dữ liệu nằm ở đâu | Chat / repo | Server Userback |

---

## 4. Khuyến nghị

1. **Tester là người** → dùng Userback gói Free, nhúng `feedback/userback-feedback.js` với `onlyForTesters: true`,
   phát link `?tester=<mã>` cho từng người.
2. **Bot** → dùng `feedback/bot-report.mjs`, đính kèm `report.md` + ảnh vào GitHub Issue (miễn phí).
   Chỉ nâng lên Business Plus để bot gửi thẳng qua REST API khi số lượng bot / phản hồi đủ lớn.
3. Khi đã dùng Userback, **ngừng tạo file `FIX-*.md` / `DEBUG-*.html`** cho từng lỗi — trạng thái lỗi nằm trong Userback.
