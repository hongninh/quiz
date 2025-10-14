# Quiz Game - Modular Architecture

Hệ thống quiz game được tách thành **Global** (dùng chung) và **Local** (riêng từng screen) để dễ dàng tích hợp vào procfu.com.

## 📁 Cấu trúc thư mục

```
quiz-game/
├── global/
│   ├── quiz-global.css          # CSS dùng chung (container, progress, buttons, feedback, results)
│   └── quiz-global.js           # Core engine (QuizEngine class, utilities)
│
├── screens/
│   ├── mcq/
│   │   ├── screen-mcq.css       # CSS cho câu hỏi text single/multi choice
│   │   └── screen-mcq.js        # Logic cho MCQ và Multi
│   │
│   ├── image/
│   │   ├── screen-image.css     # CSS cho câu hỏi image-based
│   │   └── screen-image.js      # Logic cho Image MCQ và Image Multi
│   │
│   ├── hotspot/
│   │   ├── screen-hotspot.css   # CSS cho câu hỏi click điểm
│   │   └── screen-hotspot.js    # Logic cho Hotspot và Multi Hotspot
│   │
│   ├── order/
│   │   ├── screen-order.css     # CSS cho câu hỏi sắp xếp
│   │   └── screen-order.js      # Logic cho Order (drag to reorder)
│   │
│   ├── pair/
│   │   ├── screen-pair.css      # CSS cho câu hỏi ghép cặp
│   │   └── screen-pair.js       # Logic cho Image Pair
│   │
│   └── drag-drop/
│       ├── screen-drag-drop.css # CSS cho câu hỏi kéo thả
│       └── screen-drag-drop.js  # Logic cho Drag Drop
│
├── example-usage.html           # Ví dụ sử dụng đầy đủ
└── README.md                    # File này
```

## 🚀 Cách sử dụng

### 1. **Sử dụng cơ bản (tất cả các loại câu hỏi)**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <!-- Global CSS -->
    <link rel="stylesheet" href="global/quiz-global.css">
    
    <!-- Screen-specific CSS (load tất cả) -->
    <link rel="stylesheet" href="screens/mcq/screen-mcq.css">
    <link rel="stylesheet" href="screens/image/screen-image.css">
    <link rel="stylesheet" href="screens/hotspot/screen-hotspot.css">
    <link rel="stylesheet" href="screens/order/screen-order.css">
    <link rel="stylesheet" href="screens/pair/screen-pair.css">
    <link rel="stylesheet" href="screens/drag-drop/screen-drag-drop.css">
</head>
<body>
    <div id="quiz-container"></div>

    <!-- Global JS -->
    <script src="global/quiz-global.js"></script>
    
    <!-- Screen-specific JS (load tất cả) -->
    <script src="screens/mcq/screen-mcq.js"></script>
    <script src="screens/image/screen-image.js"></script>
    <script src="screens/hotspot/screen-hotspot.js"></script>
    <script src="screens/order/screen-order.js"></script>
    <script src="screens/pair/screen-pair.js"></script>
    <script src="screens/drag-drop/screen-drag-drop.js"></script>

    <script>
        // Data quiz của bạn
        const quizData = { /* ... */ };

        // Khởi tạo
        const quiz = new QuizEngine(quizData);
        
        // Đăng ký handlers
        quiz.registerQuestionType('mcq', MCQHandler);
        quiz.registerQuestionType('multi', MultiHandler);
        quiz.registerQuestionType('image_mcq', ImageMCQHandler);
        quiz.registerQuestionType('image_multi', ImageMultiHandler);
        quiz.registerQuestionType('hotspot', HotspotHandler);
        quiz.registerQuestionType('multi_hotspot', MultiHotspotHandler);
        quiz.registerQuestionType('order', OrderHandler);
        quiz.registerQuestionType('image_pair', ImagePairHandler);
        quiz.registerQuestionType('drag_drop', DragDropHandler);
        
        // Chạy
        quiz.init('quiz-container');
    </script>
</body>
</html>
```

### 2. **Sử dụng chỉ một số loại câu hỏi (optimize)**

Nếu quiz của bạn chỉ dùng MCQ và Image MCQ:

```html
<head>
    <!-- Global CSS (bắt buộc) -->
    <link rel="stylesheet" href="global/quiz-global.css">
    
    <!-- Chỉ load screen cần dùng -->
    <link rel="stylesheet" href="screens/mcq/screen-mcq.css">
    <link rel="stylesheet" href="screens/image/screen-image.css">
</head>
<body>
    <div id="quiz-container"></div>

    <!-- Global JS (bắt buộc) -->
    <script src="global/quiz-global.js"></script>
    
    <!-- Chỉ load screen cần dùng -->
    <script src="screens/mcq/screen-mcq.js"></script>
    <script src="screens/image/screen-image.js"></script>

    <script>
        const quiz = new QuizEngine(quizData);
        
        // Chỉ đăng ký handler cần dùng
        quiz.registerQuestionType('mcq', MCQHandler);
        quiz.registerQuestionType('image_mcq', ImageMCQHandler);
        
        quiz.init('quiz-container');
    </script>
</body>
```

## 📝 Danh sách loại câu hỏi

| Question Type | Handler | CSS File | JS File |
|--------------|---------|----------|---------|
| `mcq` | `MCQHandler` | `screens/mcq/screen-mcq.css` | `screens/mcq/screen-mcq.js` |
| `multi` | `MultiHandler` | `screens/mcq/screen-mcq.css` | `screens/mcq/screen-mcq.js` |
| `image_mcq` | `ImageMCQHandler` | `screens/image/screen-image.css` | `screens/image/screen-image.js` |
| `image_multi` | `ImageMultiHandler` | `screens/image/screen-image.css` | `screens/image/screen-image.js` |
| `hotspot` | `HotspotHandler` | `screens/hotspot/screen-hotspot.css` | `screens/hotspot/screen-hotspot.js` |
| `multi_hotspot` | `MultiHotspotHandler` | `screens/hotspot/screen-hotspot.css` | `screens/hotspot/screen-hotspot.js` |
| `order` | `OrderHandler` | `screens/order/screen-order.css` | `screens/order/screen-order.js` |
| `image_pair` | `ImagePairHandler` | `screens/pair/screen-pair.css` | `screens/pair/screen-pair.js` |
| `drag_drop` | `DragDropHandler` | `screens/drag-drop/screen-drag-drop.css` | `screens/drag-drop/screen-drag-drop.js` |

## 🎨 Tùy chỉnh CSS

### Global CSS Variables (khuyến nghị)

Thêm vào `quiz-global.css`:

```css
:root {
    --quiz-primary-color: #667eea;
    --quiz-secondary-color: #764ba2;
    --quiz-correct-color: #28a745;
    --quiz-incorrect-color: #dc3545;
    --quiz-border-radius: 12px;
}
```

### Override CSS riêng cho từng trang

```html
<style>
    /* Override màu primary cho trang này */
    .quiz-container {
        --quiz-primary-color: #ff6b6b;
    }
</style>
```

## 🔧 API Reference

### QuizEngine

**Constructor:**
```javascript
const quiz = new QuizEngine(gameData);
```

**Methods:**

- `registerQuestionType(qtype, handler)` - Đăng ký handler cho loại câu hỏi
- `init(containerId)` - Khởi chạy quiz trong container
- `feedback(isCorrect, points, question, customMessage)` - Hiển thị feedback
- `nextQuestion()` - Chuyển sang câu tiếp theo

### Handler Structure

Mỗi handler cần implement 2 methods:

```javascript
const YourHandler = {
    render: function(question) {
        // Return HTML string
        return `<div>...</div>`;
    },
    
    attach: function(question) {
        // Attach event listeners
        // `this` là QuizEngine instance
    }
};
```

### QuizUtils

- `QuizUtils.downloadResults()` - Tải kết quả dưới dạng JSON
- `QuizUtils.copyResults()` - Copy kết quả vào clipboard

## 📊 Data Format

Xem file `example-usage.html` để biết cấu trúc data đầy đủ.

**Cấu trúc cơ bản:**

```javascript
{
    "main_game_id": "quiz_001",
    "main_title": "Tiêu đề quiz",
    "main_description": "Mô tả",
    "main_total_questions": 10,
    "main_total_max_points": 100,
    "main_pass_threshold_percent": 70,
    "EachQuiz": [
        {
            "qn": 1,
            "qid": "q001",
            "qtype": "mcq",
            "qtxt": "Câu hỏi?",
            "pmax": 10,
            "opt_array": ["A", "B", "C"],
            "sol_array": "A",
            "expl": "Giải thích",
            "display_correct_answer": "y"
        }
        // ...
    ]
}
```

## 🌐 Tích hợp vào procfu.com

### Option 1: Include trực tiếp

```html
<link rel="stylesheet" href="/quiz-game/global/quiz-global.css">
<link rel="stylesheet" href="/quiz-game/screens/mcq/screen-mcq.css">
<!-- ... -->
<script src="/quiz-game/global/quiz-global.js"></script>
<script src="/quiz-game/screens/mcq/screen-mcq.js"></script>
```

### Option 2: Bundle với webpack/vite

```javascript
// main.js
import './quiz-game/global/quiz-global.css';
import './quiz-game/screens/mcq/screen-mcq.css';
import { QuizEngine } from './quiz-game/global/quiz-global.js';
import { MCQHandler } from './quiz-game/screens/mcq/screen-mcq.js';
```

### Option 3: Lazy load

```javascript
// Chỉ load khi cần
async function loadQuizScreen(screenType) {
    await Promise.all([
        import(`/quiz-game/screens/${screenType}/screen-${screenType}.css`),
        import(`/quiz-game/screens/${screenType}/screen-${screenType}.js`)
    ]);
}
```

## 🎯 Best Practices

1. **Luôn load global files trước**
2. **Chỉ load screen-specific files khi cần**
3. **Cache static files**
4. **Minify CSS/JS cho production**
5. **Sử dụng CDN cho images**

## 📝 License

MIT
