# 🔧 Troubleshooting - Quiz System

## ❌ Lỗi: Quiz data loaded: undefined

### **Triệu chứng:**
```
✅ Quiz data loaded: undefined
🚀 Khởi chạy quiz: undefined
📊 KẾT QUẢ QUIZ: {
  "main_total_questions": 0,
  ...
}
```

### **Nguyên nhân:**
File `local_datainput.js` chưa được load hoặc chưa load kịp trước `local-quiz-complete.js`

---

## ✅ GIẢI PHÁP

### **Giải pháp 1: Kiểm tra thứ tự nhúng scripts** (QUAN TRỌNG NHẤT!)

```html
<!-- ❌ SAI - Thiếu local_datainput.js -->
<script src="global-quiz.js"></script>
<script src="local-quiz-complete.js"></script>

<!-- ✅ ĐÚNG - Đầy đủ và đúng thứ tự -->
<script src="global-quiz.js"></script>
<script src="local_datainput.js"></script>          ⬅️ QUAN TRỌNG!
<script src="local-quiz-complete.js"></script>
```

**Thứ tự phải là:**
1. `global-quiz.js` - Core engine
2. `local_datainput.js` - Data file ⭐ **BẮT BUỘC**
3. `local-quiz-complete.js` - Init file

---

### **Giải pháp 2: Kiểm tra đường dẫn file**

```html
<!-- Kiểm tra đường dẫn có đúng không -->
<script src="/path/to/local_datainput.js"></script>

<!-- Mở Developer Tools (F12) → Network tab → Xem file có load không -->
```

**Nếu file 404 Not Found:**
- Sửa đường dẫn cho đúng
- Đảm bảo file tồn tại trên server

---

### **Giải pháp 3: Backend render data trực tiếp (KHÔNG cần local_datainput.js)**

Nếu bạn dùng backend, KHÔNG cần file `local_datainput.js`, thay bằng:

#### **PHP/Laravel:**
```php
<!-- Blade template -->
<script>
// Backend render data trực tiếp
window.quizData = {!! json_encode($quizData) !!};

// Kiểm tra data đã set chưa
console.log('Backend data:', window.quizData);
</script>

<!-- Sau đó mới load init file -->
<script src="/js/global-quiz.js"></script>
<script src="/js/local-quiz-complete.js"></script>
```

#### **Node.js/Express (EJS):**
```html
<script>
window.quizData = <%- JSON.stringify(quizData) %>;
console.log('Backend data:', window.quizData);
</script>
<script src="/js/global-quiz.js"></script>
<script src="/js/local-quiz-complete.js"></script>
```

#### **Python/Django:**
```html
<script>
window.quizData = {{ quiz_data|safe }};
console.log('Backend data:', window.quizData);
</script>
<script src="{% static 'js/global-quiz.js' %}"></script>
<script src="{% static 'js/local-quiz-complete.js' %}"></script>
```

---

### **Giải pháp 4: Debug - Kiểm tra data đã load chưa**

Mở Console (F12) và chạy:

```javascript
// 1. Kiểm tra window.quizData
console.log('Quiz Data:', window.quizData);

// 2. Nếu undefined, check scripts đã load chưa
console.log('Scripts loaded:');
console.log('- QuizEngine:', typeof QuizEngine);
console.log('- quizData:', typeof window.quizData);

// 3. Xem network tab - file nào failed?
// F12 → Network → Filter: JS → Reload page
```

**Kết quả mong đợi:**
```javascript
window.quizData
// → {main_title: "Quiz Hoàn Chỉnh...", EachQuiz: Array(12), ...}
```

**Nếu undefined:**
- File `local_datainput.js` chưa load
- Hoặc load nhưng có lỗi syntax

---

### **Giải pháp 5: Force reload và clear cache**

```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

Hoặc:
1. F12 → Network tab
2. Tick "Disable cache"
3. Reload page

---

### **Giải pháp 6: Load data async (nâng cao)**

Nếu vẫn gặp timing issue, dùng Promise:

```javascript
// Sửa trong local-quiz-complete.js

function waitForQuizData(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkInterval = setInterval(() => {
            if (typeof window.quizData !== 'undefined' && window.quizData !== null) {
                clearInterval(checkInterval);
                resolve(window.quizData);
            }
            
            // Timeout sau 5 giây
            if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                reject(new Error('Timeout: Quiz data không load được'));
            }
        }, 50);
    });
}

function initQuiz() {
    if (typeof QuizEngine === 'undefined') {
        console.error('❌ QuizEngine chưa được load');
        return;
    }

    console.log('⏳ Đang đợi quiz data...');
    
    waitForQuizData()
        .then(quizData => {
            console.log('✅ Quiz data loaded:', quizData.main_title);
            const quiz = new QuizEngine(quizData);
            quiz.init('quiz-container');
        })
        .catch(error => {
            console.error('❌ Lỗi:', error.message);
            console.error('   → Kiểm tra file local_datainput.js đã được nhúng chưa');
        });
}
```

---

## 🔍 Checklist Debug

Nếu quiz không chạy, check từng bước:

- [ ] **1. File tồn tại?**
  - `local_datainput.js` có trong thư mục không?
  - Đường dẫn đúng chưa?

- [ ] **2. Thứ tự scripts đúng?**
  ```html
  <script src="global-quiz.js"></script>
  <script src="local_datainput.js"></script>
  <script src="local-quiz-complete.js"></script>
  ```

- [ ] **3. Network tab check:**
  - F12 → Network → Reload
  - Xem file nào failed (đỏ)?
  - Status code là gì? (404? 500?)

- [ ] **4. Console check:**
  - F12 → Console
  - Có error gì không?
  - `window.quizData` có giá trị không?

- [ ] **5. Syntax check:**
  - `local_datainput.js` có lỗi syntax không?
  - Mở file và check console có báo lỗi gì không?

---

## 📋 Template HTML đúng

### **Static files (Development):**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quiz</title>
    <link rel="stylesheet" href="global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- THỨ TỰ QUAN TRỌNG -->
    <script src="global-quiz.js"></script>
    <script src="local_datainput.js"></script>
    <script src="local-quiz-complete.js"></script>
    
    <!-- DEBUG -->
    <script>
    console.log('=== DEBUG INFO ===');
    console.log('QuizEngine:', typeof QuizEngine);
    console.log('Quiz Data:', window.quizData);
    console.log('Container:', document.getElementById('quiz-container'));
    </script>
</body>
</html>
```

### **Backend render (Production):**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quiz</title>
    <link rel="stylesheet" href="/css/global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- Backend inline data -->
    <script>
    window.quizData = <?php echo json_encode($quizData); ?>;
    console.log('✅ Data từ backend:', window.quizData?.main_title);
    </script>
    
    <!-- Scripts -->
    <script src="/js/global-quiz.js"></script>
    <script src="/js/local-quiz-complete.js"></script>
</body>
</html>
```

---

## 🆘 Nếu vẫn không được...

1. **Copy toàn bộ lỗi từ Console** (F12)
2. **Check Network tab** - file nào failed?
3. **Gửi cho team:**
   - URL trang
   - Screenshot console
   - Screenshot network tab
   - Code HTML (phần nhúng scripts)

---

## 📞 Quick Fix

**Nếu đang gấp, dùng inline data tạm:**

```html
<script>
// Copy data từ local_datainput.js vào đây
window.quizData = {
    "main_game_id": "test_001",
    "main_title": "Quiz Test",
    "main_total_questions": 2,
    "main_total_max_points": 20,
    "main_pass_threshold_percent": 70,
    "EachQuiz": [
        // ... paste data vào đây
    ]
};
</script>
<script src="global-quiz.js"></script>
<script src="local-quiz-complete.js"></script>
```

**→ Cách này LUÔN CHẠY được!**

---

**Last Updated:** 2025-10-18  
**Version:** 2.0
