# 📂 Cấu trúc Files Quiz System

## 🗂️ Danh sách files và chức năng

### **1. GLOBAL FILES (dùng chung cho tất cả quiz)**

#### `global-quiz.css`
- **Mục đích:** CSS chung cho tất cả quiz
- **Chứa:** Styles cho buttons, layouts, animations, progress bars, etc.
- **Nhúng:** Trong `<head>` của trang
- **Không cần sửa** khi tạo quiz mới

#### `global-quiz.js`
- **Mục đích:** Core engine của quiz system
- **Chứa:** 
  - Class `QuizEngine` - xử lý logic quiz
  - Render tất cả loại câu hỏi (9 types)
  - Tính điểm, thời gian, kết quả
  - `QuizUtils` - download/copy results
- **Nhúng:** Trước tất cả local JS files
- **Không cần sửa** khi tạo quiz mới

---

### **2. LOCAL FILES (riêng cho từng quiz)**

#### `local_datainput.js` ⭐ **DATA FILE**
- **Mục đích:** Chứa dữ liệu quiz
- **Chứa:** 
  - Object `window.quizData` với toàn bộ câu hỏi
  - Metadata: title, description, settings
  - Array `EachQuiz` - danh sách câu hỏi
- **Nhúng:** Sau `global-quiz.js`, trước `local-quiz-complete.js`
- **Thay đổi:** 
  - ✅ Đổi data khi tạo quiz mới
  - ✅ Hoặc thay bằng data từ backend
  - ✅ Hoặc load từ API

#### `local-quiz-complete.js` ⭐ **INIT FILE**
- **Mục đích:** Khởi tạo quiz
- **Chứa:**
  - Function `getQuizData()` - lấy data từ `local_datainput.js`
  - Function `initQuiz()` - khởi động quiz engine
  - Auto-run khi DOM ready
- **Nhúng:** Sau `local_datainput.js`
- **Không cần sửa** nhiều, chỉ customize init logic nếu cần

#### `local-quiz-complete.css`
- **Mục đích:** CSS tùy chỉnh cho quiz này
- **Chứa:** Override styles, custom theme, branding
- **Nhúng:** Sau `global-quiz.css`
- **Thay đổi:** Chỉ khi muốn custom giao diện

---

## 🔄 Quy trình tạo Quiz mới

### **Cách 1: Dùng Static Data**

```
1. Copy local_datainput.js → local_datainput_quiz2.js
2. Sửa data trong local_datainput_quiz2.js
3. Giữ nguyên local-quiz-complete.js
4. HTML nhúng theo thứ tự:
   - global-quiz.js
   - local_datainput_quiz2.js  ← file mới
   - local-quiz-complete.js
```

### **Cách 2: Dùng Backend Data**

```
1. Backend render data vào HTML:
   <script>
   window.quizData = <?php echo json_encode($quiz); ?>;
   </script>

2. KHÔNG cần local_datainput.js nữa

3. HTML nhúng:
   - global-quiz.js
   - (Backend inline script ở trên)
   - local-quiz-complete.js
```

### **Cách 3: Load từ API**

```
1. Sửa local-quiz-complete.js:
   
   function initQuiz() {
       fetch('/api/quiz/123')
           .then(res => res.json())
           .then(data => {
               window.quizData = data;
               const quiz = new QuizEngine(data);
               quiz.init('quiz-container');
           });
   }

2. KHÔNG cần local_datainput.js

3. HTML nhúng:
   - global-quiz.js
   - local-quiz-complete.js (đã sửa)
```

---

## 📋 Thứ tự nhúng files (QUAN TRỌNG!)

### **HTML đầy đủ:**

```html
<!DOCTYPE html>
<html>
<head>
    <!-- CSS -->
    <link rel="stylesheet" href="global-quiz.css">
    <link rel="stylesheet" href="local-quiz-complete.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- JavaScript - THỨ TỰ QUAN TRỌNG -->
    <script src="global-quiz.js"></script>           <!-- 1. Core engine -->
    <script src="local_datainput.js"></script>       <!-- 2. Data -->
    <script src="local-quiz-complete.js"></script>   <!-- 3. Init -->
</body>
</html>
```

### **Giải thích thứ tự:**

1. ✅ **global-quiz.js** phải load đầu tiên
   - Vì nó define class `QuizEngine`
   - Các file sau cần class này

2. ✅ **local_datainput.js** load thứ 2
   - Set biến `window.quizData`
   - File sau cần data này

3. ✅ **local-quiz-complete.js** load cuối cùng
   - Gọi `getQuizData()` lấy data
   - Khởi tạo `new QuizEngine(quizData)`

---

## 🎯 So sánh các cách tổ chức

### **Trước (1 file local):**
```
local-quiz-complete.js
├── const quizData = { ... }    ← 18KB data
└── function initQuiz() { ... }  ← Init code
```
❌ Khó maintain
❌ Không tách biệt data và logic

### **Sau (2 files local):**
```
local_datainput.js
└── window.quizData = { ... }    ← 18KB data (file riêng)

local-quiz-complete.js
├── getQuizData()                 ← Lấy data
└── initQuiz()                    ← Init code
```
✅ Tách biệt rõ ràng
✅ Dễ thay đổi data
✅ Có thể thay bằng backend data

---

## 🔀 Mapping với Backend

### **PHP/Laravel:**
```php
// Không cần local_datainput.js
// Backend render trực tiếp:

<script>
window.quizData = <?php echo json_encode($quizData); ?>;
</script>
<script src="global-quiz.js"></script>
<script src="local-quiz-complete.js"></script>
```

### **Node.js/Express:**
```ejs
<script>
window.quizData = <%- JSON.stringify(quizData) %>;
</script>
<script src="/js/global-quiz.js"></script>
<script src="/js/local-quiz-complete.js"></script>
```

### **Python/Django:**
```django
<script>
window.quizData = {{ quiz_data|safe }};
</script>
<script src="{% static 'js/global-quiz.js' %}"></script>
<script src="{% static 'js/local-quiz-complete.js' %}"></script>
```

---

## 🛠️ Customize cho từng quiz

### **Chỉ đổi data:**
- Sửa `local_datainput.js`
- Giữ nguyên tất cả files khác

### **Đổi giao diện:**
- Sửa `local-quiz-complete.css`
- Override global styles

### **Đổi init logic:**
- Sửa `local-quiz-complete.js`
- VD: thêm timer, tracking, etc.

---

## 📊 File Size

```
global-quiz.css       ~15KB  (minified ~10KB)
global-quiz.js        ~30KB  (minified ~18KB)
local_datainput.js    ~20KB  (tùy số câu hỏi)
local-quiz-complete.js ~2KB
───────────────────────────
TOTAL                 ~67KB  (minified ~50KB)
```

---

## ✅ Checklist khi deploy

- [ ] Upload `global-quiz.css` vào `/assets/css/`
- [ ] Upload `global-quiz.js` vào `/assets/js/`
- [ ] Với mỗi quiz:
  - [ ] Tạo `local_datainput_[quiz-id].js` với data
  - [ ] Hoặc backend render `window.quizData`
  - [ ] Nhúng đúng thứ tự trong HTML
- [ ] Test trên dev trước khi deploy
- [ ] Check console không có error

---

## 🐛 Debug

Nếu quiz không chạy, mở Console (F12) và check:

```javascript
// 1. Check QuizEngine
typeof QuizEngine  // phải là "function"

// 2. Check Quiz Data
typeof window.quizData  // phải là "object"
window.quizData.main_title  // in ra title

// 3. Check Container
document.getElementById('quiz-container')  // không null

// 4. Xem log
// Nếu OK sẽ thấy:
// ✅ Quiz data loaded: ...
// 🚀 Khởi chạy quiz: ...
```

---

**Last Updated:** 2025-10-18  
**Version:** 2.0 (Separated Data Structure)
