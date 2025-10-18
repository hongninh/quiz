# 📚 Quiz System - Procfu.com

Hệ thống Quiz đã được tách thành **Global** và **Local** để dễ dàng tái sử dụng cho nhiều quiz khác nhau.

## 📁 Cấu trúc files

```
├── global-quiz.css          # CSS chung cho tất cả quiz
├── global-quiz.js           # QuizEngine class (core engine)
├── local-quiz-complete.css  # CSS đặc thù cho quiz này
├── local-quiz-complete.js   # Data và khởi tạo quiz cụ thể
├── example.html             # File demo cách nhúng
└── README.md                # Hướng dẫn sử dụng
```

## 🚀 Cách sử dụng

### 1️⃣ Nhúng vào trang HTML

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <!-- Global CSS - Nhúng vào <head> -->
    <link rel="stylesheet" href="global-quiz.css">
    
    <!-- Local CSS - Nhúng sau global CSS -->
    <link rel="stylesheet" href="local-quiz-complete.css">
</head>
<body>
    <!-- Container chứa quiz -->
    <div id="quiz-container"></div>
    
    <!-- Global JS - Nhúng trước local JS -->
    <script src="global-quiz.js"></script>
    
    <!-- Local JS - Nhúng sau global JS -->
    <script src="local-quiz-complete.js"></script>
</body>
</html>
```

### 2️⃣ Tạo quiz mới

Để tạo quiz mới, bạn chỉ cần:

1. **Giữ nguyên** `global-quiz.css` và `global-quiz.js`
2. **Tạo mới** 2 files local:
   - `local-quiz-[tên-quiz].css` (nếu cần tùy chỉnh theme)
   - `local-quiz-[tên-quiz].js` (chứa data quiz mới)

**Ví dụ:** Tạo quiz về "An toàn điện"

```javascript
// File: local-quiz-electrical-safety.js

const quizData = {
    "main_game_id": "electrical_safety_2025",
    "main_title": "Quiz An Toàn Điện",
    "main_description": "Kiểm tra kiến thức về an toàn điện trong gia đình và công sở",
    "main_total_questions": 10,
    "main_total_max_points": 100,
    "main_pass_threshold_percent": 70,
    "EachQuiz": [
        {
            "qn": 1,
            "qid": "elec_001",
            "qtype": "mcq",
            "qtxt": "Điện áp an toàn cho con người là bao nhiêu?",
            "pmax": 10,
            "opt_array": ["12V", "24V", "36V", "220V"],
            "sol_array": "36V",
            "expl": "Điện áp dưới 36V được coi là an toàn cho con người.",
            // ... các trường khác
        },
        // ... các câu hỏi khác
    ]
};

// Khởi chạy quiz
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const quiz = new QuizEngine(quizData);
        quiz.init('quiz-container');
    });
} else {
    const quiz = new QuizEngine(quizData);
    quiz.init('quiz-container');
}
```

### 3️⃣ Nhúng vào procfu.com

#### **Cách 1: Nhúng trực tiếp trong template**

```html
<!-- Trong <head> của template -->
<link rel="stylesheet" href="/assets/quiz/global-quiz.css">
<link rel="stylesheet" href="/assets/quiz/local-quiz-complete.css">

<!-- Trong <body> tại vị trí cần hiển thị quiz -->
<div id="quiz-container"></div>

<!-- Trước thẻ </body> -->
<script src="/assets/quiz/global-quiz.js"></script>
<script src="/assets/quiz/local-quiz-complete.js"></script>
```

#### **Cách 2: Nhúng động qua JavaScript**

```javascript
// Hàm load quiz động
function loadQuiz(quizId) {
    // Load CSS
    const globalCSS = document.createElement('link');
    globalCSS.rel = 'stylesheet';
    globalCSS.href = '/assets/quiz/global-quiz.css';
    document.head.appendChild(globalCSS);
    
    const localCSS = document.createElement('link');
    localCSS.rel = 'stylesheet';
    localCSS.href = `/assets/quiz/local-quiz-${quizId}.css`;
    document.head.appendChild(localCSS);
    
    // Load JS
    const globalJS = document.createElement('script');
    globalJS.src = '/assets/quiz/global-quiz.js';
    globalJS.onload = () => {
        const localJS = document.createElement('script');
        localJS.src = `/assets/quiz/local-quiz-${quizId}.js`;
        document.body.appendChild(localJS);
    };
    document.body.appendChild(globalJS);
}

// Sử dụng
loadQuiz('complete');
```

#### **Cách 3: Nhúng từ API (Dynamic data)**

```javascript
// Load quiz data từ API
fetch('/api/quiz/complete_quiz_2025')
    .then(response => response.json())
    .then(quizData => {
        // Khởi tạo quiz với data từ API
        const quiz = new QuizEngine(quizData);
        quiz.init('quiz-container');
    })
    .catch(error => console.error('Error loading quiz:', error));
```

## 🎨 Tùy chỉnh Theme

Để thay đổi màu sắc, font chữ cho từng quiz, chỉnh sửa trong file `local-quiz-[tên].css`:

```css
/* Thay đổi gradient background */
body {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Thay đổi màu chủ đạo */
.question-type-badge {
    background: #ff6b6b;
}

.answer-letter {
    background: #4ecdc4;
}

.submit-button, .next-button, .retry-button {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Thêm logo/watermark */
.quiz-container::after {
    content: 'Powered by Procfu.com';
    display: block;
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}
```

## 📊 Các loại câu hỏi được hỗ trợ

1. **MCQ** (`mcq`) - Chọn 1 đáp án văn bản
2. **Multi** (`multi`) - Chọn nhiều đáp án văn bản
3. **Image MCQ** (`image_mcq`) - Chọn 1 đáp án hình ảnh
4. **Image Multi** (`image_multi`) - Chọn nhiều đáp án hình ảnh
5. **Hotspot** (`hotspot`) - Click 1 điểm trên hình
6. **Multi Hotspot** (`multi_hotspot`) - Click nhiều điểm trên hình
7. **Order** (`order`) - Sắp xếp thứ tự
8. **Image Pair** (`image_pair`) - Ghép cặp hình ảnh
9. **Drag & Drop** (`drag_drop`) - Kéo thả phân loại

## 💾 Kết quả Quiz

Kết quả quiz được:
- Lưu vào `localStorage` với key `quiz_result_latest`
- Lưu vào `window.quizFinalOutput` (object)
- In ra console (JSON format)
- Có thể download dưới dạng file JSON
- Có thể copy vào clipboard

### Format kết quả:

```json
{
  "main_game_id": "complete_quiz_2025",
  "main_game_version": "1.0.0",
  "player_info": {
    "uid": "user_xxx",
    "sid": "session_xxx",
    "att": 1
  },
  "quiz_results": [
    {
      "qn": 1,
      "qid": "traffic_001",
      "cor": true,
      "ps": 10,
      "pt": 5240,
      ...
    }
  ],
  "summary": {
    "total_score": 150,
    "max_score": 200,
    "correct_count": 9,
    "wrong_count": 3,
    "percentage": 75,
    "pass_status": "passed"
  }
}
```

## 🔧 API Reference

### QuizEngine Class

```javascript
// Khởi tạo
const quiz = new QuizEngine(quizData);

// Chạy quiz trong container
quiz.init('quiz-container');

// Properties
quiz.score              // Số câu đúng
quiz.totalPoints        // Tổng điểm đạt được
quiz.maxPoints          // Tổng điểm tối đa
quiz.currentQuestionIndex  // Câu hỏi hiện tại
quiz.quizResults        // Mảng kết quả từng câu
```

### QuizUtils Object

```javascript
// Download kết quả JSON
window.QuizUtils.downloadResults();

// Copy kết quả vào clipboard
window.QuizUtils.copyResults();

// Truy cập kết quả cuối cùng
window.quizFinalOutput;
```

## 📱 Responsive

Quiz tự động responsive cho:
- Desktop (> 768px)
- Tablet (768px)
- Mobile (< 768px)

## 🌐 Browser Support

- Chrome/Edge: ✅ 90+
- Firefox: ✅ 88+
- Safari: ✅ 14+
- Mobile browsers: ✅

## 📞 Support

Nếu cần hỗ trợ hoặc có câu hỏi, liên hệ team Procfu.com

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-10  
**Author:** Quiz Team @ Procfu.com
