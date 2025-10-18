# 🐛 Debug Checklist - Quiz không chạy

## ✅ Data đã load nhưng quiz nhảy ngay vào kết quả

### **Console log hiện tại:**
```
✅ Quiz data loaded: An Toàn Giao Thông...
🚀 Khởi chạy quiz: An Toàn Giao Thông...
📊 KẾT QUẢ QUIZ: {
  "quiz_results": [],        ← Rỗng!
  "correct_count": 0,
  "wrong_count": null,
  ...
}
```

---

## 🔍 BƯỚC 1: Kiểm tra Container

Mở Console (F12) và chạy:

```javascript
// 1. Check container có tồn tại không
console.log('Container:', document.getElementById('quiz-container'));

// 2. Nếu null → Thêm container vào HTML
```

**Nếu null, thêm vào HTML:**
```html
<div id="quiz-container"></div>
```

---

## 🔍 BƯỚC 2: Kiểm tra Data Structure

```javascript
// 1. Check số câu hỏi
console.log('Total questions:', window.quizData.main_total_questions);
console.log('EachQuiz length:', window.quizData.EachQuiz?.length);

// 2. Xem câu hỏi đầu tiên
console.log('First question:', window.quizData.EachQuiz?.[0]);

// 3. Check qtype
console.log('Question types:', 
    window.quizData.EachQuiz?.map(q => q.qtype)
);
```

**Kết quả mong đợi:**
```
Total questions: 5
EachQuiz length: 5
Question types: ["hotspot", "multi", "mcq", "order", "image_pair"]
```

---

## 🔍 BƯỚC 3: Check lỗi trong Console

Có lỗi màu đỏ không? Copy toàn bộ và gửi.

---

## 🔍 BƯỚC 4: Verify Data Format

Backend data phải có cấu trúc:

```javascript
{
    "main_game_id": "...",
    "main_title": "...",
    "main_total_questions": 5,        ← Phải có
    "main_total_max_points": 80,
    "EachQuiz": [                     ← Phải có, không rỗng
        {
            "qn": 1,
            "qid": "...",
            "qtype": "hotspot",       ← Phải hợp lệ
            "qtxt": "...",
            "pmax": 10,
            // ... các field khác
        },
        // ... 4 câu còn lại
    ]
}
```

Check:
```javascript
// Check từng field
console.log('Check data structure:');
console.log('✓ main_game_id:', window.quizData.main_game_id);
console.log('✓ main_title:', window.quizData.main_title);
console.log('✓ EachQuiz exists:', Array.isArray(window.quizData.EachQuiz));
console.log('✓ EachQuiz length:', window.quizData.EachQuiz?.length);
console.log('✓ First question qtype:', window.quizData.EachQuiz?.[0]?.qtype);
```

---

## 🔍 BƯỚC 5: Test Manual Init

Thử khởi động thủ công:

```javascript
// 1. Load lại data
const testData = window.quizData;
console.log('Test data:', testData);

// 2. Khởi tạo lại
const testQuiz = new QuizEngine(testData);
console.log('Quiz initialized:', testQuiz);
console.log('Questions loaded:', testQuiz.questions.length);

// 3. Render
testQuiz.init('quiz-container');
```

---

## ✅ GIẢI PHÁP THƯỜNG GẶP

### **Lỗi 1: Container không tồn tại**

```html
<!-- Thêm vào HTML -->
<div id="quiz-container"></div>
```

### **Lỗi 2: Data thiếu EachQuiz**

Check:
```javascript
console.log('Has EachQuiz:', 'EachQuiz' in window.quizData);
console.log('EachQuiz type:', typeof window.quizData.EachQuiz);
console.log('Is Array:', Array.isArray(window.quizData.EachQuiz));
```

Nếu undefined → Backend chưa truyền đủ data

### **Lỗi 3: qtype không hợp lệ**

Các qtype hợp lệ:
- `mcq` - Multiple choice (1 đáp án)
- `multi` - Multiple choice (nhiều đáp án)
- `image_mcq` - Hình ảnh 1 đáp án
- `image_multi` - Hình ảnh nhiều đáp án
- `hotspot` - Click 1 điểm
- `multi_hotspot` - Click nhiều điểm
- `order` - Sắp xếp thứ tự
- `image_pair` - Ghép cặp
- `drag_drop` - Kéo thả

Check:
```javascript
window.quizData.EachQuiz.forEach((q, i) => {
    console.log(`Q${i+1}: ${q.qtype} - ${q.qtxt}`);
});
```

### **Lỗi 4: Timing issue**

Thử delay init:
```javascript
// Trong local-quiz-complete.js
setTimeout(() => {
    initQuiz();
}, 500);
```

---

## 🎯 Full Debug Script

Copy đoạn này vào Console và chạy:

```javascript
console.log('=== QUIZ DEBUG INFO ===');
console.log('1. Container:', document.getElementById('quiz-container'));
console.log('2. QuizEngine:', typeof QuizEngine);
console.log('3. Quiz Data:', window.quizData);
console.log('4. Data keys:', window.quizData ? Object.keys(window.quizData) : 'null');
console.log('5. Total questions:', window.quizData?.main_total_questions);
console.log('6. EachQuiz length:', window.quizData?.EachQuiz?.length);
console.log('7. EachQuiz is Array:', Array.isArray(window.quizData?.EachQuiz));

if (window.quizData?.EachQuiz) {
    console.log('8. Question types:', 
        window.quizData.EachQuiz.map(q => q.qtype)
    );
    console.log('9. First question:', window.quizData.EachQuiz[0]);
}

// Test init
try {
    const testQuiz = new QuizEngine(window.quizData);
    console.log('10. Test init success:', testQuiz.questions.length, 'questions');
} catch (e) {
    console.error('10. Test init failed:', e);
}
```

---

## 📸 Gửi cho team nếu vẫn lỗi:

1. Screenshot Console (toàn bộ)
2. Kết quả của debug script ở trên
3. HTML code (phần quiz-container và scripts)
4. Network tab - file nào failed?

---

**Next Steps:**
1. Chạy debug script ở trên
2. Copy kết quả
3. Gửi để tôi phân tích tiếp
