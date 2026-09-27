# 🐞 Phản hồi kiểm thử quiz: NocoBase + Userback

Tài liệu ghi lại **cách phản hồi trước đây trong NocoBase**, **giải pháp khi thêm Userback**
(chụp màn hình + mô tả), và **ưu / nhược điểm**.

> Tên bảng / trường bên dưới là đề xuất. Nếu NocoBase của bạn đã có bảng với tên khác,
> chỉ cần đổi `NOCOBASE_COLLECTION` và tên trường cho khớp.

---

## 1. Lý thuyết trước đây: phản hồi thuần NocoBase

### 1.1 Mô hình

```
Danh sách kiểm thử (bảng testers: bot + người)
        │  mỗi tester được giao quiz / game
        ▼
Tester chơi quiz
        │  gửi kết quả + nhận xét
        ▼
NocoBase: tạo bản ghi phản hồi
  - bot  → gọi API  POST /api/<bảng_phản_hồi>:create
  - người → điền form NocoBase
        │
        ▼
Người phụ trách xem bảng phản hồi, lọc, đổi trạng thái
```

### 1.2 Nguyên lý

- NocoBase là **nơi duy nhất** chứa danh sách tester, quiz và phản hồi.
- Phản hồi chủ yếu là **văn bản / số liệu** (kết quả, lỗi, nhận xét) nhập qua form hoặc API.
- Bot và người cùng đổ vào **một bảng**, quản lý bằng quyền (role) và workflow của NocoBase.

### 1.3 Hạn chế

| Vấn đề | Hệ quả |
|---|---|
| Không có ảnh chụp màn hình tự động | Lỗi giao diện (lệch ảnh, kéo thả, hotspot) khó mô tả bằng lời |
| Người phải tự ghi đang ở câu nào, trình duyệt gì | Thiếu ngữ cảnh, phải hỏi lại |
| Muốn kèm ảnh thì phải tự chụp → lưu → tải lên form | Chậm, tester thường bỏ qua |
| Không thấy lỗi JavaScript xảy ra trên trình duyệt của tester | Lỗi “bấm không ăn” không tái hiện được |

---

## 2. Giải pháp: NocoBase vẫn là trung tâm, thêm Userback cho người

### 2.1 Kiến trúc

```
TESTER NGƯỜI
  Quiz (trong iframe block của NocoBase hoặc trang công khai)
  + widget Userback (feedback/userback-feedback.js)
    │  chụp màn hình, khoanh vùng, quay video, gõ mô tả
    │  tự gắn: game_id, câu số mấy, nội dung câu, lỗi JS gần nhất, mã tester, trình duyệt
    ▼
  Userback dashboard
    │  (tuỳ chọn) webhook ──► NocoBase Workflow (trigger Webhook) ──► tạo bản ghi quiz_feedbacks
    ▼
  NocoBase: quiz_feedbacks  ◄───────────────────────────────┐
                                                             │ API key
BOT TRONG DANH SÁCH KIỂM THỬ                                 │
  feedback/bot-report.mjs                                    │
    │  tự chơi quiz, chụp từng bước, ghi lỗi console         │
    ├─► POST /api/attachments:create   (tải ảnh)             │
    └─► POST /api/quiz_feedbacks:create (bản ghi + ảnh) ─────┘
```

**Vì sao bot không dùng Userback:** widget Userback là giao diện cho người bấm tay. Bot gửi vào Userback
chỉ được qua REST API của Userback, mà REST API / webhook chỉ có ở gói cao nhất (Business Plus).
Bot gửi thẳng vào NocoBase thì **miễn phí, giữ đúng chỗ như trước**, nay có thêm ảnh chụp.

### 2.2 Bảng dữ liệu đề xuất trong NocoBase

**`testers` – danh sách kiểm thử** (có thể đã có)

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `code` | Single line text (unique) | `bot-01`, `chi-lan` – dùng trong link `?tester=` |
| `name` | Single line text | |
| `kind` | Single select | `bot` / `người` |
| `active` | Checkbox | |

**`quiz_feedbacks` – phản hồi**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `title` | Single line text | |
| `source` | Single select | `bot` / `userback` / `form` |
| `status` | Single select | `new` / `in_progress` / `done` / `ok` (bot chơi không lỗi) |
| `tester_code` | Single line text | Nối với `testers.code` (hoặc đổi thành quan hệ Many-to-one) |
| `game_id` | Single line text | |
| `question_number` | Single line text | |
| `description` | Markdown | Bot ghi báo cáo từng bước |
| `errors` | JSON | Lỗi console / JS |
| `context` | JSON | Ngữ cảnh từng bước |
| `screenshots` | Attachment | Ảnh chụp |
| `userback_url` | URL | Link phản hồi bên Userback (nếu đồng bộ) |

### 2.3 Các file

| File | Vai trò |
|---|---|
| `feedback/userback-feedback.js` | Tải widget Userback, gắn ngữ cảnh quiz, ghi 20 lỗi JS gần nhất, nhận diện tester |
| `feedback/demo.html` | Trang quiz mẫu có nút “🐞 Báo lỗi / Góp ý” |
| `feedback/bot-report.mjs` | Bot tự chơi → ảnh + báo cáo → gửi vào NocoBase |

### 2.4 Quy ước đánh dấu quiz (`data-quiz-*`)

Widget và bot không phụ thuộc vào cấu trúc quiz cụ thể; chỉ cần quiz gắn các thuộc tính sau:

| Thuộc tính | Gắn vào | Dùng cho |
|---|---|---|
| `data-quiz-game-id="<id>"` | Khung bao quiz | `game_id` trong phản hồi (hoặc truyền `gameId` trong cấu hình) |
| `data-quiz-question-number` | Chỗ hiện số câu hiện tại | `question_number` |
| `data-quiz-total` | Chỗ hiện tổng số câu | `total_questions` |
| `data-quiz-question-text` | Nội dung câu hỏi | `question_text` |
| `data-quiz-answer` | Mỗi nút đáp án | Bot chọn đáp án |
| `data-quiz-next` | Nút “Tiếp theo” | Bot sang câu |
| `data-quiz-result` | Màn hình kết quả (ẩn khi đang làm) | Bot biết đã chơi xong |

Ví dụ đầy đủ: `feedback/demo.html`. Quiz đã có selector khác thì đặt `ANSWER_SELECTOR`, `NEXT_SELECTOR`, `RESULT_SELECTOR` khi chạy bot.

### 2.5 Cài đặt cho bot

1. Tạo bảng `quiz_feedbacks` như trên.
2. Tạo **role** riêng cho bot, chỉ cho phép: *tạo* bản ghi `quiz_feedbacks` và *tải tệp lên*.
3. **Settings → API keys** → tạo key gắn role đó (đặt thời hạn).
4. Chạy bot:

```bash
npm i -D playwright
NOCOBASE_URL=https://nocobase.cua-ban.vn/api \
NOCOBASE_API_KEY=xxxxx \
node feedback/bot-report.mjs "https://<link-quiz>" bot-01
```

- Không đặt `NOCOBASE_URL` → bot chỉ lưu báo cáo tại `feedback-reports/…`.
- Exit code: `0` chơi hết không lỗi · `2` có lỗi · `3` gửi NocoBase thất bại (báo cáo vẫn lưu cục bộ).
- Quiz chưa dùng quy ước `data-quiz-*` → đặt `ANSWER_SELECTOR`, `NEXT_SELECTOR`, `RESULT_SELECTOR`.
- API key **chỉ đặt ở máy chạy bot**, không bao giờ đưa vào trang quiz.

### 2.6 Cài đặt cho tester người (Userback)

1. Tạo tài khoản Userback → tạo **Project**.
2. Thêm **domain của NocoBase** (và domain trang quiz nếu quiz chạy ở nơi khác) vào project.
   Widget không hiện nếu domain chưa được thêm.
3. Lấy **Access Token** trong Userback (Settings → Install).
4. Trong NocoBase, thêm **Iframe block** ở trang quiz, chọn chế độ **HTML**, dán quiz + 2 thẻ script:

```html
<script>
    window.QUIZ_FEEDBACK = {
        accessToken: 'USERBACK_ACCESS_TOKEN',
        testerId: '{{$user.username}}',   // chèn biến "Current user" bằng nút biến của iframe block
        testerName: '{{$user.nickname}}',
        onlyForTesters: true               // chỉ hiện widget khi biết tester
    };
</script>
<script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@main/feedback/userback-feedback.js"></script>
```

   Nếu quiz là trang công khai (không đăng nhập NocoBase), gửi cho tester link có `?tester=<code>`.

5. Tester gặp lỗi → bấm nút Userback → chụp → khoanh vùng → mô tả → Gửi.

Dữ liệu tự đính kèm mỗi phản hồi (mục *Custom data* trong Userback):

```json
{
  "game_id": "demo-001",
  "question_number": "2",
  "total_questions": "2",
  "question_text": "HTML là viết tắt của gì?",
  "tester_id": "chi-lan",
  "viewport": "1280x720",
  "recent_errors": [{ "time": "...", "message": "Uncaught TypeError ..." }]
}
```

### 2.7 Đưa phản hồi Userback về NocoBase (tuỳ chọn)

| Cách | Cần | Ghi chú |
|---|---|---|
| Userback webhook → NocoBase Workflow trigger **Webhook** → node *Create record* `quiz_feedbacks` (`source = userback`) | Userback **Business Plus** + plugin **Workflow: Webhook** của NocoBase (bản thương mại) | Tự động hoàn toàn, tốn phí cả hai phía |
| Người phụ trách tạo bản ghi và dán `userback_url` | Không | Miễn phí, làm tay |
| Không đồng bộ: người xem ở Userback, bot xem ở NocoBase | Không | Đơn giản nhất nhưng phản hồi nằm 2 nơi |

---

## 3. Ưu / nhược điểm khi dùng Userback

### ✅ Ưu điểm

| Ưu điểm | Chi tiết |
|---|---|
| **Ảnh chụp + khoanh vùng + quay video** | Công cụ có sẵn, tester không cần phần mềm chụp màn hình |
| **Tự đính kèm ngữ cảnh** | Câu đang làm, game id, lỗi JS, trình duyệt, kích thước màn hình |
| **Không phải xây gì trong NocoBase** | Nhúng 2 thẻ script, không viết plugin |
| **Gói Free** | Theo thông tin công khai: không giới hạn số phản hồi và số người dùng |
| **Dashboard riêng cho phản hồi** | Có trạng thái, gán người xử lý, bình luận |

### ❌ Nhược điểm

| Nhược điểm | Chi tiết / cách giảm |
|---|---|
| **Phản hồi nằm 2 nơi** | Người → Userback, bot → NocoBase. Đồng bộ tự động cần Userback Business Plus + plugin Webhook NocoBase |
| **Bot không dùng được widget** | Bot gửi thẳng NocoBase bằng `bot-report.mjs` |
| **REST API / webhook Userback đắt** | Chỉ gói Business Plus (~159–199 USD/tháng theo nguồn công khai 2026 — kiểm tra lại giá) |
| **Dữ liệu ra ngoài** | Ảnh chụp, mô tả lưu trên server Userback, không nằm trong NocoBase của bạn |
| **Ảnh chụp phía trình duyệt không hoàn hảo** | Ảnh, canvas, video không cho phép tải chéo (CORS) có thể bị trắng. Widget trong iframe chỉ chụp phần quiz, không chụp giao diện NocoBase bên ngoài |
| **Iframe nhỏ thì form Userback bị chật** | Đặt chiều cao iframe block đủ lớn (≥ 600px) |
| **Quyền riêng tư** | Dùng `onlyForTesters: true` để học viên thật không thấy nút |
| **Thêm script bên thứ ba** | Có thể bị trình chặn quảng cáo chặn; cache jsDelivr `@main` chậm cập nhật → dùng `@<commit>` |

### 📊 So sánh

| Tiêu chí | NocoBase thuần (trước đây) | NocoBase + Userback (đề xuất) | Tự làm nút chụp trong NocoBase |
|---|---|---|---|
| Ảnh chụp cho người | ❌ phải tự chụp | ✅ có khoanh vùng, video | ✅ chụp được, không khoanh vùng/video |
| Ảnh chụp cho bot | ❌ | ✅ qua `bot-report.mjs` | ✅ qua `bot-report.mjs` |
| Ngữ cảnh tự động | ❌ | ✅ | ✅ (tự code) |
| Dữ liệu ở một nơi | ✅ | ⚠️ 2 nơi (trừ khi trả phí đồng bộ) | ✅ |
| Dữ liệu trên server mình | ✅ | ❌ phần của người | ✅ |
| Công sức xây dựng | Thấp | Thấp | Trung bình – cao, tự bảo trì |
| Chi phí | 0 | 0 (Free) → cao nếu cần đồng bộ | 0 |

---

## 4. Khuyến nghị

1. **Bot** → dùng ngay `feedback/bot-report.mjs` gửi vào NocoBase (miễn phí, có ảnh chụp, đúng bảng như trước).
2. **Người** → thử Userback gói Free trong iframe block với `onlyForTesters: true`.
3. Sau 2–4 tuần dùng thử:
   - Phản hồi của người ít, chấp nhận nằm ở Userback → giữ nguyên, dán `userback_url` khi cần.
   - Cần mọi thứ trong NocoBase → cân nhắc trả phí đồng bộ, **hoặc** tự làm nút chụp màn hình trong NocoBase
     (tải ảnh qua `attachments:create`, giống cách bot đang làm) và bỏ Userback.
