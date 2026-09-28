# 🐞 Phản hồi kiểm thử quiz (NocoBase)

Tài liệu ghi lại **cách phản hồi trước đây trong NocoBase**, **2 bot kiểm thử** (gửi trực tiếp và
gửi qua nút góp ý) và **phương án Userback** (đang tạm dừng vì đã có tool góp ý nội bộ).

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

## 2. Hai bot kiểm thử

### 2.1 Kiến trúc

```
Bot trong danh sách kiểm thử: tự chơi quiz, chụp từng bước, ghi lỗi console
  │
  ├─► Bot 1 – bot-direct
  │     POST /api/attachments:create     (tải ảnh)
  │     POST /api/quiz_feedbacks:create  (bản ghi + ảnh)  ──► NocoBase: quiz_feedbacks
  │
  └─► Bot 2 – bot-button
        bấm nút "Góp ý" góc phải → điền mô tả → đính ảnh → Gửi
        (đi đúng đường của người dùng thật)                ──► tool góp ý nội bộ
```

| | Bot 1 – `bot-direct` | Bot 2 – `bot-button` |
|---|---|---|
| Gửi phản hồi bằng | API NocoBase (API key) | Nút “Góp ý” góc phải trên giao diện |
| Kiểm thử được | Quiz | Quiz **và** tool góp ý nội bộ (nút có hiện không, form có gửi được không) |
| Dữ liệu gửi | Đầy đủ: mô tả, lỗi, ngữ cảnh từng bước, **mọi** ảnh chụp | Những gì form góp ý cho phép: mô tả ngắn + 1 ảnh |
| Cần | API key có quyền tạo bản ghi + tải tệp | Phiên đăng nhập (nếu tool yêu cầu), selector nếu tool khác mặc định |
| Khi hỏng | Lỗi API → exit 3, báo cáo vẫn lưu cục bộ | Không thấy nút / không gửi được → exit 4, có ảnh chụp chỗ hỏng |

Cả 2 bot đều lưu báo cáo cục bộ tại `feedback-reports/<thời-gian>-<bot>-<tester>/` (`report.md`, `report.json`, `step-*.png`).

### 2.2 Bảng dữ liệu đề xuất trong NocoBase

**`testers` – danh sách kiểm thử** (có thể đã có)

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `code` | Single line text (unique) | `bot-01`, `chi-lan` – dùng trong link `?tester=` |
| `name` | Single line text | |
| `kind` | Single select | `bot` / `người` |
| `active` | Checkbox | |

**`quiz_feedbacks` – phản hồi** (bot-direct ghi vào đây; bot-button đi qua tool nội bộ)

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `title` | Single line text | |
| `source` | Single select | `bot-direct` / `form` / … |
| `status` | Single select | `new` / `in_progress` / `done` / `ok` (bot chơi không lỗi) |
| `tester_code` | Single line text | Nối với `testers.code` (hoặc đổi thành quan hệ Many-to-one) |
| `game_id` | Single line text | |
| `question_number` | Single line text | |
| `description` | Markdown | Báo cáo từng bước |
| `errors` | JSON | Lỗi console / JS |
| `context` | JSON | Ngữ cảnh từng bước |
| `screenshots` | Attachment | Ảnh chụp |

### 2.3 Các file

| File | Vai trò |
|---|---|
| `feedback/bots/lib.mjs` | Phần chung: mở quiz, tự chơi, chụp ảnh, ghi lỗi, đọc ngữ cảnh, lưu báo cáo |
| `feedback/bots/bot-direct.mjs` | Bot 1 – gửi thẳng vào NocoBase |
| `feedback/bots/bot-button.mjs` | Bot 2 – gửi qua nút góp ý góc phải |
| `feedback/demo.html` | Quiz mẫu + mô phỏng nút “💬 Góp ý” góc phải để thử 2 bot |
| `feedback/userback-feedback.js` | Widget Userback (tạm dừng, xem mục 3) |

### 2.4 Quy ước đánh dấu quiz (`data-quiz-*`)

Bot không phụ thuộc vào cấu trúc quiz cụ thể; chỉ cần quiz gắn các thuộc tính sau:

| Thuộc tính | Gắn vào | Dùng cho |
|---|---|---|
| `data-quiz-game-id="<id>"` | Khung bao quiz | `game_id` trong phản hồi |
| `data-quiz-question-number` | Chỗ hiện số câu hiện tại | `question_number` |
| `data-quiz-total` | Chỗ hiện tổng số câu | `total_questions` |
| `data-quiz-question-text` | Nội dung câu hỏi | `question_text` |
| `data-quiz-answer` | Mỗi nút đáp án | Bot chọn đáp án |
| `data-quiz-next` | Nút “Tiếp theo” | Bot sang câu |
| `data-quiz-result` | Màn hình kết quả (ẩn khi đang làm) | Bot biết đã chơi xong |

Quiz đã có selector khác thì đặt `ANSWER_SELECTOR`, `NEXT_SELECTOR`, `RESULT_SELECTOR` khi chạy bot.

### 2.5 Chuẩn bị chung

```bash
npm i -D playwright
```

Quiz cần đăng nhập NocoBase → lưu phiên đăng nhập của tài khoản bot một lần, rồi truyền `STORAGE_STATE`:

```bash
npx playwright codegen --save-storage=auth.json "https://nocobase.cua-ban.vn"   # đăng nhập bằng tài khoản bot rồi đóng cửa sổ
STORAGE_STATE=auth.json node feedback/bots/bot-button.mjs "<link-quiz>" bot-02
```

`auth.json` chứa phiên đăng nhập – **không commit** lên repo.

### 2.6 Bot 1 – `bot-direct`

1. Tạo bảng `quiz_feedbacks` như trên.
2. Tạo **role** riêng cho bot, chỉ cho phép: *tạo* bản ghi `quiz_feedbacks` và *tải tệp lên*.
3. **Settings → API keys** → tạo key gắn role đó (đặt thời hạn).
4. Chạy:

```bash
NOCOBASE_URL=https://nocobase.cua-ban.vn/api \
NOCOBASE_API_KEY=xxxxx \
node feedback/bots/bot-direct.mjs "<link-quiz>" bot-01
```

- Không đặt `NOCOBASE_URL` → chỉ lưu báo cáo cục bộ.
- Exit code: `0` chơi hết không lỗi · `2` quiz có lỗi · `3` gửi NocoBase thất bại.
- API key **chỉ đặt ở máy chạy bot**, không bao giờ đưa vào trang quiz.

### 2.7 Bot 2 – `bot-button`

```bash
node feedback/bots/bot-button.mjs "<link-quiz>" bot-02
```

Các bước bot làm sau khi chơi xong:

1. Chụp màn hình hiện tại.
2. Tìm nút góp ý: phần tử có chữ / `aria-label` / `title` khớp `góp ý|feedback|phản hồi|báo lỗi`, chọn cái **nằm góc phải-dưới nhất**.
3. Bấm nút → chờ ô mô tả (`textarea` hoặc vùng soạn thảo) hiện ra → điền: mã bot, kết quả, game, câu, danh sách lỗi.
4. Đính ảnh: nếu tool có nút “chụp màn hình” (khai báo `FEEDBACK_SCREENSHOT_SELECTOR`) thì bấm nút đó; không thì đưa ảnh vào ô chọn tệp `input[type=file]`; không có cả hai thì bỏ qua ảnh.
5. Bấm nút có chữ `Gửi|Submit|Send` → chờ chữ `Cảm ơn|thành công|đã gửi|thank`.

Tool nội bộ khác mặc định → khai báo selector:

| Biến | Dùng khi |
|---|---|
| `FEEDBACK_BUTTON_SELECTOR` / `FEEDBACK_BUTTON_TEXT` | Nút góp ý có chữ khác hoặc bot chọn nhầm nút |
| `FEEDBACK_TEXT_SELECTOR` | Ô mô tả không phải `textarea` |
| `FEEDBACK_FILE_SELECTOR` | Có nhiều ô chọn tệp trên trang |
| `FEEDBACK_SCREENSHOT_SELECTOR` | Tool có nút tự chụp màn hình |
| `FEEDBACK_SUBMIT_SELECTOR` | Nút gửi có chữ khác |
| `FEEDBACK_SUCCESS_TEXT` | Thông báo thành công có chữ khác |

- Exit code: `0` không lỗi · `2` quiz có lỗi (đã gửi góp ý) · `4` không gửi được qua nút góp ý.
- Nếu nút góp ý nằm trong iframe khác domain với quiz, bot chưa hỗ trợ – cần báo lại để bổ sung.

---

## 3. Userback (tạm dừng)

Hiện đã có tool góp ý nội bộ nên **tạm không dùng Userback**. Phần dưới giữ lại để tham khảo nếu cần
thêm công cụ khoanh vùng / quay video cho tester người sau này. `feedback/userback-feedback.js` vẫn còn,
chỉ chạy khi được nhúng vào trang.

### 3.1 Cài đặt (khi dùng lại)

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

### 3.2 Đưa phản hồi Userback về NocoBase (tuỳ chọn)

| Cách | Cần | Ghi chú |
|---|---|---|
| Userback webhook → NocoBase Workflow trigger **Webhook** → node *Create record* `quiz_feedbacks` (`source = userback`) | Userback **Business Plus** + plugin **Workflow: Webhook** của NocoBase (bản thương mại) | Tự động hoàn toàn, tốn phí cả hai phía |
| Người phụ trách tạo bản ghi và dán link Userback (thêm trường `userback_url` kiểu URL) | Không | Miễn phí, làm tay |
| Không đồng bộ: người xem ở Userback, bot xem ở NocoBase | Không | Đơn giản nhất nhưng phản hồi nằm 2 nơi |

### 3.3 Ưu / nhược điểm

#### ✅ Ưu điểm

| Ưu điểm | Chi tiết |
|---|---|
| **Ảnh chụp + khoanh vùng + quay video** | Công cụ có sẵn, tester không cần phần mềm chụp màn hình |
| **Tự đính kèm ngữ cảnh** | Câu đang làm, game id, lỗi JS, trình duyệt, kích thước màn hình |
| **Không phải xây gì trong NocoBase** | Nhúng 2 thẻ script, không viết plugin |
| **Gói Free** | Theo thông tin công khai: không giới hạn số phản hồi và số người dùng |
| **Dashboard riêng cho phản hồi** | Có trạng thái, gán người xử lý, bình luận |

#### ❌ Nhược điểm

| Nhược điểm | Chi tiết / cách giảm |
|---|---|
| **Phản hồi nằm 2 nơi** | Người → Userback, bot → NocoBase. Đồng bộ tự động cần Userback Business Plus + plugin Webhook NocoBase |
| **Bot không dùng được widget** | Bot dùng `bot-direct` / `bot-button` |
| **REST API / webhook Userback đắt** | Chỉ gói Business Plus (~159–199 USD/tháng theo nguồn công khai 2026 — kiểm tra lại giá) |
| **Dữ liệu ra ngoài** | Ảnh chụp, mô tả lưu trên server Userback, không nằm trong NocoBase của bạn |
| **Ảnh chụp phía trình duyệt không hoàn hảo** | Ảnh, canvas, video không cho phép tải chéo (CORS) có thể bị trắng. Widget trong iframe chỉ chụp phần quiz, không chụp giao diện NocoBase bên ngoài |
| **Iframe nhỏ thì form Userback bị chật** | Đặt chiều cao iframe block đủ lớn (≥ 600px) |
| **Quyền riêng tư** | Dùng `onlyForTesters: true` để học viên thật không thấy nút |
| **Thêm script bên thứ ba** | Có thể bị trình chặn quảng cáo chặn; cache jsDelivr `@main` chậm cập nhật → dùng `@<commit>` |

#### 📊 So sánh

| Tiêu chí | NocoBase thuần (trước đây) | NocoBase + Userback (tạm dừng) | Tự làm nút chụp trong NocoBase |
|---|---|---|---|
| Ảnh chụp cho người | ❌ phải tự chụp | ✅ có khoanh vùng, video | ✅ chụp được, không khoanh vùng/video |
| Ảnh chụp cho bot | ❌ | ✅ qua 2 bot | ✅ qua 2 bot |
| Ngữ cảnh tự động | ❌ | ✅ | ✅ (tự code) |
| Dữ liệu ở một nơi | ✅ | ⚠️ 2 nơi (trừ khi trả phí đồng bộ) | ✅ |
| Dữ liệu trên server mình | ✅ | ❌ phần của người | ✅ |
| Công sức xây dựng | Thấp | Thấp | Trung bình – cao, tự bảo trì |
| Chi phí | 0 | 0 (Free) → cao nếu cần đồng bộ | 0 |

---

---

## 4. Khuyến nghị

1. Chạy **cả 2 bot** định kỳ:
   - `bot-direct` → báo cáo đầy đủ về quiz (mọi ảnh, mọi lỗi) vào `quiz_feedbacks`.
   - `bot-button` → kiểm tra tool góp ý nội bộ vẫn hoạt động: nút còn hiện, form gửi được, ảnh đính được.
     Exit code `4` nghĩa là **người dùng thật cũng không góp ý được** – cần xử lý ngay.
2. Đặt mã tester khác nhau cho 2 bot (vd `bot-01` cho direct, `bot-02` cho nút) để lọc trong NocoBase.
3. Userback: giữ tạm dừng; chỉ xem lại nếu tester người cần khoanh vùng / quay video mà tool nội bộ chưa có.
