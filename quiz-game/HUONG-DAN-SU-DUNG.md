# HƯỚNG DẪN SỬ DỤNG QUIZ GAME

## 📋 Tổng quan

Code quiz game đã được **tách thành 2 phần**:

### 1. **GLOBAL** (Dùng chung cho tất cả)
- `global/quiz-global.css` - CSS chung (container, nút, progress bar, kết quả)
- `global/quiz-global.js` - Engine chính (QuizEngine class)

### 2. **LOCAL** (Riêng từng loại câu hỏi)
- `screens/mcq/` - Câu hỏi text (chọn 1 hoặc nhiều)
- `screens/image/` - Câu hỏi hình ảnh
- `screens/hotspot/` - Click điểm trên hình
- `screens/order/` - Sắp xếp thứ tự
- `screens/pair/` - Ghép cặp
- `screens/drag-drop/` - Kéo thả phân loại

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
    
    <!-- 2. LOAD CSS CHO CÁC LOẠI CÂU HỎI BẠN SẼ DÙNG -->
    <link rel="stylesheet" href="quiz-game/screens/mcq/screen-mcq.css">
    <link rel="stylesheet" href="quiz-game/screens/image/screen-image.css">
    <!-- Thêm các loại khác nếu cần... -->
</head>
<body>
    <!-- Container để hiển thị quiz -->
    <div id="quiz-container"></div>

    <!-- 3. LUÔN LOAD GLOBAL JS -->
    <script src="quiz-game/global/quiz-global.js"></script>
    
    <!-- 4. LOAD JS CHO CÁC LOẠI CÂU HỎI BẠN SẼ DÙNG -->
    <script src="quiz-game/screens/mcq/screen-mcq.js"></script>
    <script src="quiz-game/screens/image/screen-image.js"></script>
    <!-- Thêm các loại khác nếu cần... -->

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

| Loại | `qtype` | Handler | File CSS | File JS |
|------|---------|---------|----------|---------|
| Chọn 1 đáp án (text) | `mcq` | `MCQHandler` | `screens/mcq/screen-mcq.css` | `screens/mcq/screen-mcq.js` |
| Chọn nhiều đáp án (text) | `multi` | `MultiHandler` | `screens/mcq/screen-mcq.css` | `screens/mcq/screen-mcq.js` |
| Chọn 1 hình | `image_mcq` | `ImageMCQHandler` | `screens/image/screen-image.css` | `screens/image/screen-image.js` |
| Chọn nhiều hình | `image_multi` | `ImageMultiHandler` | `screens/image/screen-image.css` | `screens/image/screen-image.js` |
| Click 1 điểm | `hotspot` | `HotspotHandler` | `screens/hotspot/screen-hotspot.css` | `screens/hotspot/screen-hotspot.js` |
| Click nhiều điểm | `multi_hotspot` | `MultiHotspotHandler` | `screens/hotspot/screen-hotspot.css` | `screens/hotspot/screen-hotspot.js` |
| Sắp xếp | `order` | `OrderHandler` | `screens/order/screen-order.css` | `screens/order/screen-order.js` |
| Ghép cặp | `image_pair` | `ImagePairHandler` | `screens/pair/screen-pair.css` | `screens/pair/screen-pair.js` |
| Kéo thả | `drag_drop` | `DragDropHandler` | `screens/drag-drop/screen-drag-drop.css` | `screens/drag-drop/screen-drag-drop.js` |

## 💡 Ví dụ cụ thể

### Ví dụ 1: Quiz chỉ có MCQ (tối ưu)

```html
<head>
    <!-- Chỉ load global + mcq -->
    <link rel="stylesheet" href="quiz-game/global/quiz-global.css">
    <link rel="stylesheet" href="quiz-game/screens/mcq/screen-mcq.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <script src="quiz-game/global/quiz-global.js"></script>
    <script src="quiz-game/screens/mcq/screen-mcq.js"></script>
    
    <script>
        const quiz = new QuizEngine(quizData);
        quiz.registerQuestionType('mcq', MCQHandler);
        quiz.init('quiz-container');
    </script>
</body>
```

### Ví dụ 2: Quiz có nhiều loại

```html
<head>
    <!-- Global -->
    <link rel="stylesheet" href="quiz-game/global/quiz-global.css">
    
    <!-- Các screen cần dùng -->
    <link rel="stylesheet" href="quiz-game/screens/mcq/screen-mcq.css">
    <link rel="stylesheet" href="quiz-game/screens/image/screen-image.css">
    <link rel="stylesheet" href="quiz-game/screens/hotspot/screen-hotspot.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <script src="quiz-game/global/quiz-global.js"></script>
    <script src="quiz-game/screens/mcq/screen-mcq.js"></script>
    <script src="quiz-game/screens/image/screen-image.js"></script>
    <script src="quiz-game/screens/hotspot/screen-hotspot.js"></script>
    
    <script>
        const quiz = new QuizEngine(quizData);
        
        // Đăng ký tất cả loại câu hỏi sẽ dùng
        quiz.registerQuestionType('mcq', MCQHandler);
        quiz.registerQuestionType('multi', MultiHandler);
        quiz.registerQuestionType('image_mcq', ImageMCQHandler);
        quiz.registerQuestionType('hotspot', HotspotHandler);
        
        quiz.init('quiz-container');
    </script>
</body>
```

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
