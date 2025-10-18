# 🔧 Hướng dẫn sử dụng Data riêng biệt

## 📁 Cấu trúc mới (đã tách data)

```
quiz-system/
├── global-quiz.css              # CSS chung
├── global-quiz.js               # Quiz Engine
├── local_datainput.js          # ⭐ DATA FILE (NEW)
├── local-quiz-complete.js       # Init file (đã sửa để gọi data)
└── local-quiz-complete.css      # CSS tùy chỉnh
```

---

## 🎯 Cách sử dụng

### **1. Sử dụng data có sẵn (local_datainput.js)**

**HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="global-quiz.css">
    <link rel="stylesheet" href="local-quiz-complete.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- THỨ TỰ QUAN TRỌNG -->
    <script src="global-quiz.js"></script>
    <script src="local_datainput.js"></script>          ⬅️ Load data
    <script src="local-quiz-complete.js"></script>      ⬅️ Init quiz
</body>
</html>
```

✅ **Kết quả:** Quiz chạy với data từ `local_datainput.js`

---

### **2. Thay thế data bằng Backend**

#### **PHP/Laravel:**

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/assets/css/global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- Backend inline data -->
    <script>
    // THAY THẾ local_datainput.js bằng đoạn này
    window.quizData = <?php echo json_encode($quizData); ?>;
    </script>
    
    <!-- Load quiz engine và init -->
    <script src="/assets/js/global-quiz.js"></script>
    <script src="/assets/js/local-quiz-complete.js"></script>
</body>
</html>
```

#### **Node.js/Express (EJS):**

```html
<script>
window.quizData = <%- JSON.stringify(quizData) %>;
</script>
<script src="/js/global-quiz.js"></script>
<script src="/js/local-quiz-complete.js"></script>
```

#### **Python/Django:**

```html
<script>
window.quizData = {{ quiz_data|safe }};
</script>
<script src="{% static 'js/global-quiz.js' %}"></script>
<script src="{% static 'js/local-quiz-complete.js' %}"></script>
```

✅ **Kết quả:** Quiz chạy với data từ backend, KHÔNG cần `local_datainput.js`

---

### **3. Load data từ API (AJAX)**

**Sửa file `local-quiz-complete.js`:**

```javascript
// Thay thế function initQuiz() hiện tại bằng:

function initQuiz() {
    if (typeof QuizEngine === 'undefined') {
        console.error('❌ QuizEngine chưa được load');
        return;
    }

    const container = document.getElementById('quiz-container');
    
    // Hiển thị loading
    container.innerHTML = '<div style="text-align:center;padding:50px;">Đang tải quiz...</div>';
    
    // Lấy quiz ID từ URL hoặc attribute
    const quizId = container.dataset.quizId || 'default';
    
    // Gọi API
    fetch(`/api/quiz/${quizId}`)
        .then(response => response.json())
        .then(quizData => {
            // Khởi tạo quiz với data từ API
            const quiz = new QuizEngine(quizData);
            quiz.init('quiz-container');
            console.log('✅ Quiz loaded from API');
        })
        .catch(error => {
            console.error('❌ Lỗi load quiz:', error);
            container.innerHTML = '<div style="color:red;text-align:center;padding:50px;">Không thể tải quiz!</div>';
        });
}
```

**HTML:**

```html
<div id="quiz-container" data-quiz-id="123"></div>

<script src="global-quiz.js"></script>
<!-- KHÔNG cần local_datainput.js -->
<script src="local-quiz-complete.js"></script>  ⬅️ Đã sửa để load từ API
```

✅ **Kết quả:** Quiz load data từ API endpoint `/api/quiz/123`

---

## 🔄 Tạo Quiz mới

### **Cách 1: Copy data file**

```bash
# Copy file data
cp local_datainput.js local_datainput_quiz2.js

# Sửa data trong local_datainput_quiz2.js
# Đổi: window.quizData = { ... }

# HTML nhúng file mới
<script src="global-quiz.js"></script>
<script src="local_datainput_quiz2.js"></script>    ⬅️ File data mới
<script src="local-quiz-complete.js"></script>        ⬅️ Giữ nguyên
```

### **Cách 2: Backend generate data file**

```php
// PHP: Generate JS file động
public function generateQuizDataJS($quizId) {
    $quiz = Quiz::find($quizId);
    $js = "window.quizData = " . json_encode($quiz) . ";";
    
    return response($js)
           ->header('Content-Type', 'application/javascript');
}

// Route
Route::get('/quiz-data/{id}.js', 'QuizController@generateQuizDataJS');

// HTML
<script src="/quiz-data/123.js"></script>  ⬅️ Backend generate
<script src="/js/global-quiz.js"></script>
<script src="/js/local-quiz-complete.js"></script>
```

---

## 🧪 Test và Debug

### **1. Kiểm tra data đã load chưa:**

Mở Console (F12) và chạy:

```javascript
// Check data
window.quizData

// Xem title
window.quizData.main_title

// Xem số câu hỏi
window.quizData.EachQuiz.length

// Xem câu hỏi đầu tiên
window.quizData.EachQuiz[0]
```

### **2. Xem log:**

Nếu quiz chạy OK, console sẽ hiển thị:

```
✅ Quiz data loaded: Quiz Hoàn Chỉnh - 12 Câu Hỏi Đa Dạng
🚀 Khởi chạy quiz: Quiz Hoàn Chỉnh - 12 Câu Hỏi Đa Dạng
```

### **3. Nếu có lỗi:**

```
❌ Quiz data chưa được load. Hãy chắc chắn local_datainput.js đã được nhúng trước file này.
```

→ Kiểm tra thứ tự load scripts trong HTML

---

## 📊 Format dữ liệu trong local_datainput.js

```javascript
window.quizData = {
    // Metadata
    "main_game_id": "quiz_001",
    "main_title": "Tiêu đề quiz",
    "main_description": "Mô tả quiz",
    "main_total_questions": 10,
    "main_total_max_points": 100,
    "main_pass_threshold_percent": 70,
    
    // Danh sách câu hỏi
    "EachQuiz": [
        {
            "qn": 1,
            "qid": "q1",
            "qtype": "mcq",           // Loại câu hỏi
            "qtxt": "Câu hỏi?",       // Nội dung
            "pmax": 10,                // Điểm tối đa
            "opt_array": ["A","B","C","D"],  // Đáp án
            "sol_array": "A",          // Đáp án đúng
            "expl": "Giải thích",      // Lời giải
            "display_correct_answer": "y"
        },
        // ... các câu khác
    ]
};
```

---

## ⚡ Performance Tips

### **1. Minify data file:**

```bash
# Dùng tool minify
uglifyjs local_datainput.js -o local_datainput.min.js -c -m

# HTML load file minified
<script src="local_datainput.min.js"></script>
```

### **2. Lazy load:**

Chỉ load data khi cần:

```javascript
function loadQuizData(quizId) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/quiz-data/${quizId}.js`;
        script.onload = () => resolve(window.quizData);
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Sử dụng
loadQuizData('123').then(data => {
    const quiz = new QuizEngine(data);
    quiz.init('quiz-container');
});
```

### **3. Cache data:**

```javascript
// localStorage cache
const cachedData = localStorage.getItem('quiz_123');
if (cachedData) {
    window.quizData = JSON.parse(cachedData);
} else {
    fetch('/api/quiz/123')
        .then(res => res.json())
        .then(data => {
            window.quizData = data;
            localStorage.setItem('quiz_123', JSON.stringify(data));
        });
}
```

---

## 🔒 Security Notes

### **1. Validate data:**

```javascript
function validateQuizData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    if (!data.EachQuiz || !Array.isArray(data.EachQuiz)) {
        return false;
    }
    if (data.EachQuiz.length === 0) {
        return false;
    }
    return true;
}

// Trong initQuiz()
const quizData = getQuizData();
if (!validateQuizData(quizData)) {
    console.error('❌ Invalid quiz data');
    return;
}
```

### **2. Sanitize user input:**

Nếu data đến từ backend/API, đảm bảo đã sanitize:

```php
// PHP
$quizData = Quiz::find($id);
$safe = htmlspecialchars(json_encode($quizData), ENT_QUOTES, 'UTF-8');

// Output
echo "<script>window.quizData = {$safe};</script>";
```

---

## 📞 Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `QuizEngine is not defined` | Chưa load `global-quiz.js` | Thêm `<script src="global-quiz.js">` |
| `window.quizData is undefined` | Chưa load data | Thêm `<script src="local_datainput.js">` hoặc backend script |
| Quiz không hiện | Sai thứ tự scripts | Load đúng: global → data → init |
| Data bị lỗi format | JSON không hợp lệ | Validate JSON bằng jsonlint.com |

---

**Version:** 2.0  
**Last Updated:** 2025-10-18  
**Author:** Quiz Team @ Procfu.com
