# 🔌 Hướng dẫn tích hợp Quiz với Backend

## 📍 Vị trí thay thế trong code

Trong file `local-quiz-complete.js`, thay thế **DÒNG 8** (biến `quizData`):

```javascript
// ❌ BỎ DÒNG NÀY:
const quizData = { /* hardcoded data */ };

// ✅ THAY BẰNG CODE LẤY TỪ BACKEND
```

---

## 🎯 3 Cách tích hợp Backend

### **CÁCH 1: Data Attribute (KHUYÊN DÙNG ⭐)**

#### Backend template:

```html
<!-- PHP/Laravel -->
<div id="quiz-container" data-input="{{ json_encode($quizData) }}"></div>

<!-- Node.js/Express EJS -->
<div id="quiz-container" data-input="<%= JSON.stringify(quizData) %>"></div>

<!-- Python/Django -->
<div id="quiz-container" data-input="{{ quiz_data|tojson }}"></div>

<!-- ASP.NET -->
<div id="quiz-container" data-input="@Html.Raw(Json.Encode(Model.QuizData))"></div>
```

#### JavaScript code (thay vào local-quiz-*.js):

```javascript
// THAY THẾ từ dòng 8 trở đi:

function initQuiz() {
    const container = document.getElementById('quiz-container');
    const dataInput = container.getAttribute('data-input');
    
    if (!dataInput) {
        console.error('Không tìm thấy data-input!');
        return;
    }
    
    try {
        const quizData = JSON.parse(dataInput);
        const quiz = new QuizEngine(quizData);
        quiz.init('quiz-container');
    } catch (error) {
        console.error('Lỗi parse JSON:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
```

---

### **CÁCH 2: Biến Global JavaScript**

#### Backend template:

```html
<!-- PHP/Laravel -->
<script>
var dataInput = <?php echo json_encode($quizData); ?>;
</script>

<!-- Node.js/Express -->
<script>
var dataInput = <%- JSON.stringify(quizData) %>;
</script>

<!-- Python/Flask -->
<script>
var dataInput = {{ quiz_data | tojson }};
</script>
```

#### JavaScript code:

```javascript
// THAY THẾ từ dòng 8:

function initQuiz() {
    if (typeof dataInput === 'undefined') {
        console.error('Biến dataInput không tồn tại!');
        return;
    }
    
    const quiz = new QuizEngine(dataInput);
    quiz.init('quiz-container');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
```

---

### **CÁCH 3: Load từ API (AJAX)**

#### Backend API endpoint:

```javascript
// Node.js/Express
app.get('/api/quiz/:id', (req, res) => {
    const quizData = getQuizFromDatabase(req.params.id);
    res.json(quizData);
});

// PHP/Laravel
Route::get('/api/quiz/{id}', function ($id) {
    $quizData = Quiz::find($id);
    return response()->json($quizData);
});
```

#### JavaScript code:

```javascript
// THAY THẾ từ dòng 8:

function initQuiz() {
    const container = document.getElementById('quiz-container');
    const quizId = container.getAttribute('data-quiz-id') || 'default';
    
    container.innerHTML = '<div style="text-align:center;padding:50px;">Đang tải...</div>';
    
    fetch(`/api/quiz/${quizId}`)
        .then(response => response.json())
        .then(quizData => {
            const quiz = new QuizEngine(quizData);
            quiz.init('quiz-container');
        })
        .catch(error => {
            console.error('Lỗi load quiz:', error);
            container.innerHTML = '<div style="color:red;">Không thể tải quiz!</div>';
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
```

HTML:
```html
<div id="quiz-container" data-quiz-id="123"></div>
```

---

## 🚀 Sử dụng file có sẵn

Tôi đã tạo file **`local-quiz-backend-example.js`** hỗ trợ CẢ 3 CÁCH tự động:

```html
<!-- Thay thế local-quiz-complete.js bằng: -->
<script src="local-quiz-backend-example.js"></script>
```

File này sẽ tự động detect:
1. ✅ `data-input` attribute → Parse JSON
2. ✅ `window.dataInput` variable → Dùng luôn
3. ✅ `data-quiz-id` attribute → Gọi API

---

## 📋 Ví dụ thực tế từng Backend

### PHP/Laravel (Blade)

```php
// Controller
public function showQuiz($id) {
    $quiz = Quiz::with('questions')->find($id);
    return view('quiz.show', ['quizData' => $quiz]);
}
```

```html
<!-- resources/views/quiz/show.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{{ asset('css/global-quiz.css') }}">
</head>
<body>
    <div id="quiz-container" data-input="{{ json_encode($quizData) }}"></div>
    
    <script src="{{ asset('js/global-quiz.js') }}"></script>
    <script src="{{ asset('js/local-quiz-backend-example.js') }}"></script>
</body>
</html>
```

---

### Node.js/Express (EJS)

```javascript
// routes/quiz.js
router.get('/quiz/:id', async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    res.render('quiz', { quizData: quiz });
});
```

```html
<!-- views/quiz.ejs -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/css/global-quiz.css">
</head>
<body>
    <div id="quiz-container" data-input='<%- JSON.stringify(quizData) %>'></div>
    
    <script src="/js/global-quiz.js"></script>
    <script src="/js/local-quiz-backend-example.js"></script>
</body>
</html>
```

---

### Python/Django

```python
# views.py
from django.shortcuts import render
from .models import Quiz

def quiz_view(request, quiz_id):
    quiz = Quiz.objects.get(id=quiz_id)
    return render(request, 'quiz.html', {'quiz_data': quiz.to_dict()})
```

```html
<!-- templates/quiz.html -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{% static 'css/global-quiz.css' %}">
</head>
<body>
    <div id="quiz-container" data-input='{{ quiz_data|safe }}'></div>
    
    <script src="{% static 'js/global-quiz.js' %}"></script>
    <script src="{% static 'js/local-quiz-backend-example.js' %}"></script>
</body>
</html>
```

---

### Python/Flask

```python
# app.py
from flask import render_template, jsonify

@app.route('/quiz/<int:quiz_id>')
def quiz_page(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    return render_template('quiz.html', quiz_data=quiz.to_json())
```

```html
<!-- templates/quiz.html -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/global-quiz.css') }}">
</head>
<body>
    <div id="quiz-container" data-input='{{ quiz_data | tojson }}'></div>
    
    <script src="{{ url_for('static', filename='js/global-quiz.js') }}"></script>
    <script src="{{ url_for('static', filename='js/local-quiz-backend-example.js') }}"></script>
</body>
</html>
```

---

## ⚠️ Lưu ý quan trọng

### 1. Escape JSON trong HTML attribute

```html
<!-- ❌ SAI: Có thể break HTML -->
<div data-input="{"key": "value with "quotes""}"></div>

<!-- ✅ ĐÚNG: Dùng single quote bên ngoài -->
<div data-input='{"key": "value with \"quotes\""}'></div>

<!-- ✅ ĐÚNG: Hoặc encode HTML entities -->
<div data-input="&quot;key&quot;:&quot;value&quot;"></div>
```

### 2. Check data trước khi parse

```javascript
const dataInput = container.getAttribute('data-input');
if (!dataInput || dataInput.trim() === '') {
    console.error('Data rỗng!');
    return;
}
```

### 3. Handle lỗi JSON parse

```javascript
try {
    const quizData = JSON.parse(dataInput);
} catch (error) {
    console.error('JSON không hợp lệ:', error);
    console.log('Raw data:', dataInput);
}
```

---

## 🔍 Debug

Mở Console (F12) và chạy:

```javascript
// Xem raw data
console.log(document.getElementById('quiz-container').getAttribute('data-input'));

// Parse thử
JSON.parse(document.getElementById('quiz-container').getAttribute('data-input'));

// Xem biến global
console.log(window.dataInput);
```

---

## 📞 Hỗ trợ

Nếu gặp lỗi, kiểm tra:
1. ✅ Data có đúng format JSON không?
2. ✅ Special characters có được escape đúng không?
3. ✅ Script có load đúng thứ tự không? (global → local)
4. ✅ Container `#quiz-container` có tồn tại không?
