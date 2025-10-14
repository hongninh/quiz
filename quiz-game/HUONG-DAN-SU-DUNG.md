# HƯỚNG DẪN SỬ DỤNG QUIZ GAME

## 📋 Tổng quan

Code quiz game đã được **tách thành 2 phần**:

### 1. **GLOBAL** (Dùng chung cho tất cả)
- `global/quiz-global.css` - CSS chung (container, nút, progress bar, kết quả)
- `global/quiz-global.js` - Engine chính (QuizEngine class)

### 2. **SCREENS** (Tất cả loại câu hỏi trong 2 file)
- `screens/screens-all.css` - CSS cho tất cả loại câu hỏi
- `screens/screens-all.js` - JS handlers cho tất cả loại câu hỏi

## 🚀 Cách dùng nhanh

### Bước 1: Copy folder `quiz-game` vào project

```
your-project/
├── quiz-game/          ← Copy folder này vào
└── your-page.html
```

### Bước 2: Include vào HTML

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <!-- 1. LUÔN LOAD GLOBAL CSS -->
    <link rel="stylesheet" href="quiz-game/global/quiz-global.css">
    
    <!-- 2. LOAD SCREENS CSS (tất cả loại câu hỏi) -->
    <link rel="stylesheet" href="quiz-game/screens/screens-all.css">
</head>
<body>
    <!-- Container để hiển thị quiz -->
    <div id="quiz-container"></div>

    <!-- 3. LUÔN LOAD GLOBAL JS -->
    <script src="quiz-game/global/quiz-global.js"></script>
    
    <!-- 4. LOAD SCREENS JS (tất cả handlers) -->
    <script src="quiz-game/screens/screens-all.js"></script>

    <script>
        // 5. DATA QUIZ CỦA BẠN
        const quizData = {
            "main_title": "Tên quiz",
            "main_description": "Mô tả",
            "main_total_questions": 5,
            "main_total_max_points": 50,
            "main_pass_threshold_percent": 70,
            "EachQuiz": [
                {
                    "qn": 1,
                    "qtype": "mcq",
                    "qtxt": "Câu hỏi của bạn?",
                    "pmax": 10,
                    "opt_array": ["Đáp án A", "Đáp án B", "Đáp án C"],
                    "sol_array": "Đáp án A",
                    "expl": "Giải thích",
                    "display_correct_answer": "y"
                }
                // ... thêm câu hỏi khác
            ]
        };

        // 6. KHỞI TẠO QUIZ
        document.addEventListener('DOMContentLoaded', () => {
            const quiz = new QuizEngine(quizData);
            
            // Đăng ký handler cho từng loại câu hỏi
            quiz.registerQuestionType('mcq', MCQHandler);
            quiz.registerQuestionType('multi', MultiHandler);
            quiz.registerQuestionType('image_mcq', ImageMCQHandler);
            quiz.registerQuestionType('image_multi', ImageMultiHandler);
            // ... đăng ký các loại khác nếu dùng
            
            // Chạy quiz
            quiz.init('quiz-container');
        });
    </script>
</body>
</html>
```

## 📝 Các loại câu hỏi và Handler

| Loại | `qtype` | Handler | Files |
|------|---------|---------|-------|
| Chọn 1 đáp án (text) | `mcq` | `MCQHandler` | `screens/screens-all.*` |
| Chọn nhiều đáp án (text) | `multi` | `MultiHandler` | `screens/screens-all.*` |
| Chọn 1 hình | `image_mcq` | `ImageMCQHandler` | `screens/screens-all.*` |
| Chọn nhiều hình | `image_multi` | `ImageMultiHandler` | `screens/screens-all.*` |
| Click 1 điểm | `hotspot` | `HotspotHandler` | `screens/screens-all.*` |
| Click nhiều điểm | `multi_hotspot` | `MultiHotspotHandler` | `screens/screens-all.*` |
| Sắp xếp | `order` | `OrderHandler` | `screens/screens-all.*` |
| Ghép cặp | `image_pair` | `ImagePairHandler` | `screens/screens-all.*` |
| Kéo thả | `drag_drop` | `DragDropHandler` | `screens/screens-all.*` |

**Lưu ý:** Tất cả CSS và JS đã được gộp vào 2 file `screens-all.css` và `screens-all.js` để dễ sử dụng.

## 💡 Ví dụ cụ thể

### Ví dụ: Sử dụng quiz (rất đơn giản!)

```html
<head>
    <!-- Load 3 files: global CSS, screens CSS, global JS, screens JS -->
    <link rel="stylesheet" href="quiz-game/global/quiz-global.css">
    <link rel="stylesheet" href="quiz-game/screens/screens-all.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <script src="quiz-game/global/quiz-global.js"></script>
    <script src="quiz-game/screens/screens-all.js"></script>
    
    <script>
        const quiz = new QuizEngine(quizData);
        
        // Đăng ký tất cả loại câu hỏi (đã có sẵn trong screens-all.js)
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
    </script>
</body>
```

**Lợi ích:** Chỉ cần load 4 files (2 CSS + 2 JS) thay vì nhiều files như trước!

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc toàn bộ quiz

Thêm vào CSS của bạn:

```css
/* Override màu chủ đạo */
.quiz-container {
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}

.submit-button,
.next-button {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.progress-fill {
    background: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
}
```

### Thay đổi font chữ

```css
body {
    font-family: 'Roboto', 'Arial', sans-serif;
}
```

## 📂 File demo có sẵn

1. **`example-usage.html`** - Ví dụ đầy đủ tất cả loại câu hỏi
2. **`demo-single-type.html`** - Ví dụ chỉ dùng 1 loại (MCQ)

Mở file này bằng trình duyệt để xem demo!

## 🔧 Tích hợp vào procfu.com

### Option 1: Include trực tiếp trong HTML

```html
<link rel="stylesheet" href="/assets/quiz-game/global/quiz-global.css">
<script src="/assets/quiz-game/global/quiz-global.js"></script>
```

### Option 2: Dùng trong React/Vue

```javascript
import '/quiz-game/global/quiz-global.css';
import '/quiz-game/screens/mcq/screen-mcq.css';

// Component của bạn
function QuizPage() {
    useEffect(() => {
        const quiz = new QuizEngine(quizData);
        quiz.registerQuestionType('mcq', MCQHandler);
        quiz.init('quiz-container');
    }, []);
    
    return <div id="quiz-container"></div>;
}
```

## ❓ FAQ

### Q: Tôi chỉ cần MCQ thôi, phải load hết không?

**A:** KHÔNG! Chỉ cần load:
- `global/quiz-global.css`
- `global/quiz-global.js`
- `screens/mcq/screen-mcq.css`
- `screens/mcq/screen-mcq.js`

### Q: Làm sao để thêm loại câu hỏi mới?

**A:** Tạo handler mới theo cấu trúc:

```javascript
const MyCustomHandler = {
    render: function(q) {
        return `<div>HTML của bạn</div>`;
    },
    attach: function(q) {
        // Event listeners
        this.feedback(isCorrect, points, q);
    }
};

quiz.registerQuestionType('my_custom', MyCustomHandler);
```

### Q: Data quiz phải có format như thế nào?

**A:** Xem file `example-usage.html`, phần `const quizData = { ... }`

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console browser (F12) có lỗi gì không
2. Đã load đủ file CSS/JS chưa
3. Đã đăng ký handler chưa
4. Format data có đúng không

---

**Chúc bạn tích hợp thành công! 🎉**
