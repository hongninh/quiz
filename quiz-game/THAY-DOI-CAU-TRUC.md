# 🔄 THAY ĐỔI CẤU TRÚC - ĐƠN GIẢN HÓA

## ✨ Điều gì đã thay đổi?

### Trước đây (Cấu trúc phức tạp):
```
screens/
├── mcq/
│   ├── screen-mcq.css
│   └── screen-mcq.js
├── image/
│   ├── screen-image.css
│   └── screen-image.js
├── hotspot/
│   ├── screen-hotspot.css
│   └── screen-hotspot.js
├── order/
│   ├── screen-order.css
│   └── screen-order.js
├── pair/
│   ├── screen-pair.css
│   └── screen-pair.js
└── drag-drop/
    ├── screen-drag-drop.css
    └── screen-drag-drop.js
```

**Phải load:** 12 files (6 CSS + 6 JS)

---

### Bây giờ (Đơn giản hơn):
```
screens/
├── screens-all.css    ← Gộp tất cả CSS
└── screens-all.js     ← Gộp tất cả JS
```

**Chỉ cần load:** 2 files! 🎉

---

## 🚀 Cách sử dụng mới (CỰC ĐƠN GIẢN)

### HTML:
```html
<head>
    <!-- Global CSS & JS -->
    <link rel="stylesheet" href="quiz-game/global/quiz-global.css">
    <script src="quiz-game/global/quiz-global.js"></script>
    
    <!-- Screens CSS & JS (chỉ 2 files!) -->
    <link rel="stylesheet" href="quiz-game/screens/screens-all.css">
    <script src="quiz-game/screens/screens-all.js"></script>
</head>
```

### JavaScript:
```javascript
const quiz = new QuizEngine(quizData);

// Đăng ký tất cả handlers (đã có trong screens-all.js)
quiz.registerQuestionType('mcq', MCQHandler);
quiz.registerQuestionType('multi', MultiHandler);
quiz.registerQuestionType('image_mcq', ImageMCQHandler);
quiz.registerQuestionType('image_multi', ImageMultiHandler);
quiz.registerQuestionType('hotspot', HotspotHandler);
quiz.registerQuestionType('multi_hotspot', MultiHotspotHandler);
quiz.registerQuestionType('order', OrderHandler);
quiz.registerQuestionType('image_pair', ImagePairHandler);
quiz.registerQuestionType('drag_drop', DragDropHandler);

quiz.init('quiz-container');
```

---

## ✅ Lợi ích

| Tiêu chí | Trước | Sau |
|----------|-------|-----|
| **Số files CSS** | 6 files | 1 file |
| **Số files JS** | 6 files | 1 file |
| **Tổng files screens** | 12 files | 2 files |
| **HTTP requests** | 12 requests | 2 requests |
| **Dễ sử dụng** | Phải nhớ load nhiều files | Chỉ load 2 files |
| **Maintain** | Dễ (mỗi loại độc lập) | Dễ (tất cả ở 1 chỗ) |

---

## 📦 Tổng kết cấu trúc mới

```
quiz-game/
├── global/                          ← LUÔN CẦN (2 files)
│   ├── quiz-global.css
│   └── quiz-global.js
│
├── screens/                         ← ĐƠN GIẢN (2 files)
│   ├── screens-all.css             ← Tất cả CSS cho 9 loại câu hỏi
│   └── screens-all.js              ← Tất cả JS handlers
│
├── index.html                       ← Trang chính
├── example-usage.html               ← Demo đầy đủ
├── demo-single-type.html            ← Demo đơn giản
└── [Các file tài liệu...]

TỔNG: 4 files code chính (2 global + 2 screens)
```

---

## 🎯 So sánh code

### Trước (phức tạp):
```html
<!-- Phải load 12 files -->
<link rel="stylesheet" href="screens/mcq/screen-mcq.css">
<link rel="stylesheet" href="screens/image/screen-image.css">
<link rel="stylesheet" href="screens/hotspot/screen-hotspot.css">
<!-- ... 3 files nữa -->

<script src="screens/mcq/screen-mcq.js"></script>
<script src="screens/image/screen-image.js"></script>
<script src="screens/hotspot/screen-hotspot.js"></script>
<!-- ... 3 files nữa -->
```

### Sau (đơn giản):
```html
<!-- Chỉ cần 2 files! -->
<link rel="stylesheet" href="screens/screens-all.css">
<script src="screens/screens-all.js"></script>
```

---

## 💡 Lưu ý

✅ **Vẫn giữ nguyên:**
- Tất cả chức năng
- 9 loại câu hỏi
- API không đổi
- Cách đăng ký handlers như cũ

✅ **Thay đổi:**
- Chỉ đơn giản hóa cách load files
- Giảm số HTTP requests
- Dễ sử dụng hơn

---

## 🎉 Kết luận

**CŨ:** Load 14 files (2 global + 12 screens)  
**MỚI:** Load 4 files (2 global + 2 screens)

**→ Giảm 71% số files cần load!**

---

**Cập nhật:** 2025-10-14  
**Phiên bản:** 2.0 (Simplified)
