# 🔄 Cập nhật Quiz System sang ID System

## 📋 **TỔ chức QUAN:**

Hệ thống quiz đã được nâng cấp từ index-based sang **ID-based** để:
- ✅ Shuffle-safe (xáo trộn câu trả lời không ảnh hưởng kết quả)
- ✅ Clear tracking (backend dễ track user chọn gì)
- ✅ Better analytics (phân tích chi tiết)
- ✅ Multi-language support (giữ ID, chỉ thay text)

---

## 📦 **FILES MỚI:**

### **1. Core Files:**
- `global-quiz-with-ids.js` - Quiz engine mới (thay thế `global-quiz.js`)
- `local_datainput_with_ids.js` - Data mẫu với ID (thay thế `local_datainput.js`)

### **2. Documentation:**
- `DATA-FORMAT-WITH-IDS.md` - Spec chi tiết format data
- `UPDATE-TO-ID-SYSTEM.md` - File này

---

## 🚀 **CÁCH SỬ DỤNG:**

### **Option 1: Project mới (Recommended)**

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>

    <!-- Backend data -->
    <script>
    var my_variables = {
        questions_and_answers_input_text_format: <?= json_encode($quiz) ?>
    };
    </script>

    <!-- NEW: Quiz engine with ID system -->
    <script src="global-quiz-with-ids.js"></script>
    <script src="local_datainput_backend.js"></script>
    <script src="local-quiz-complete.js"></script>
</body>
</html>
```

### **Option 2: Update project cũ**

**Bước 1:** Thay file:
```bash
# Backup file cũ
cp global-quiz.js global-quiz-OLD.js

# Dùng file mới
cp global-quiz-with-ids.js global-quiz.js
```

**Bước 2:** Update data format (xem phần dưới)

---

## 🔄 **UPDATE DATA FORMAT:**

### **1. TEXT Questions (mcq, multi, order)**

**CŨ:**
```json
{
  "qtype": "mcq",
  "opt_array": ["Đáp án A", "Đáp án B", "Đáp án C"],
  "sol_array": "Đáp án A"
}
```

**MỚI:**
```json
{
  "qtype": "mcq",
  "opt_array": [
    { "text_id": "opt_001_1", "text": "Đáp án A" },
    { "text_id": "opt_001_2", "text": "Đáp án B" },
    { "text_id": "opt_001_3", "text": "Đáp án C" }
  ],
  "sol_array": "opt_001_1"
}
```

---

### **2. IMAGE Questions (image_mcq, image_multi)**

**CŨ:**
```json
{
  "qtype": "image_mcq",
  "opt_array": [
    { "text": "Mũ bảo hiểm", "image": "https://..." },
    { "text": "Nón lá", "image": "https://..." }
  ],
  "sol_array": 0
}
```

**MỚI:**
```json
{
  "qtype": "image_mcq",
  "opt_array": [
    { "image_id": "img_006_1", "text": "Mũ bảo hiểm", "image": "https://..." },
    { "image_id": "img_006_2", "text": "Nón lá", "image": "https://..." }
  ],
  "sol_array": "img_006_1"
}
```

---

### **3. HOTSPOT (single)**

**CŨ:**
```json
{
  "qtype": "hotspot",
  "sol_json": { "x": 400, "y": 300, "radius": 80 }
}
```

**MỚI:**
```json
{
  "qtype": "hotspot",
  "sol_json": { 
    "x_y_id": "hotspot_001",
    "x": 400,
    "y": 300,
    "radius": 80
  }
}
```

---

### **4. MULTI HOTSPOT**

**CŨ:**
```json
{
  "qtype": "multi_hotspot",
  "hotspot_array": [
    { "id": "spot_1", "x": 25, "y": 30 },
    { "id": "spot_2", "x": 50, "y": 40 }
  ],
  "sol_array": ["spot_1", "spot_2"]
}
```

**MỚI:**
```json
{
  "qtype": "multi_hotspot",
  "hotspot_array": [
    { "x_y_id": "spot_010_1", "x": 25, "y": 30 },
    { "x_y_id": "spot_010_2", "x": 50, "y": 40 }
  ],
  "sol_array": ["spot_010_1", "spot_010_2"]
}
```

---

### **5. IMAGE PAIR**

**CŨ:**
```json
{
  "qtype": "image_pair",
  "image_json": [
    "https://image1.jpg",
    "https://image2.jpg",
    "https://image3.jpg"
  ],
  "sol_array": [[0, 0], [1, 1], [2, 2]]
}
```

**MỚI:**
```json
{
  "qtype": "image_pair",
  "image_json": [
    { "image_id": "img_005_1", "image": "https://image1.jpg" },
    { "image_id": "img_005_2", "image": "https://image2.jpg" },
    { "image_id": "img_005_3", "image": "https://image3.jpg" },
    { "image_id": "img_005_4", "image": "https://image4.jpg" },
    { "image_id": "img_005_5", "image": "https://image5.jpg" },
    { "image_id": "img_005_6", "image": "https://image6.jpg" }
  ],
  "sol_array": [
    ["img_005_1", "img_005_4"],
    ["img_005_2", "img_005_5"],
    ["img_005_3", "img_005_6"]
  ]
}
```

---

### **6. DRAG & DROP**

**CŨ:**
```json
{
  "qtype": "drag_drop",
  "drag_items": [
    { "id": "item_1", "label": "...", "image": "...", "correct_zone": "safe" }
  ]
}
```

**MỚI:**
```json
{
  "qtype": "drag_drop",
  "drag_items": [
    { "image_id": "img_009_1", "label": "...", "image": "...", "correct_zone": "safe" }
  ]
}
```

---

## 🔧 **BACKEND UPDATE:**

### **PHP/Laravel:**

```php
// Update output để include IDs
$quiz = [
    'main_game_id' => 'quiz_001',
    'EachQuiz' => [
        [
            'qn' => 1,
            'qtype' => 'mcq',
            'opt_array' => [
                ['text_id' => 'opt_001_1', 'text' => 'Đáp án A'],
                ['text_id' => 'opt_001_2', 'text' => 'Đáp án B'],
            ],
            'sol_array' => 'opt_001_1'
        ]
    ]
];

echo json_encode($quiz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
```

### **Node.js:**

```javascript
const quiz = {
    main_game_id: 'quiz_001',
    EachQuiz: [{
        qn: 1,
        qtype: 'mcq',
        opt_array: [
            { text_id: 'opt_001_1', text: 'Đáp án A' },
            { text_id: 'opt_001_2', text: 'Đáp án B' }
        ],
        sol_array: 'opt_001_1'
    }]
};

res.json(quiz);
```

---

## 📊 **OUTPUT KẾT QUẢ:**

Kết quả quiz giờ sẽ include IDs:

```json
{
  "question_id": "traffic_001",
  "question_number": 1,
  "question_type": "mcq",
  "user_answer": "opt_001_2",
  "correct_answer": "opt_001_1",
  "is_correct": false,
  "points_earned": 0,
  "max_points": 10
}
```

**Lợi ích:**
- ✅ Backend biết chính xác user chọn gì (opt_001_2)
- ✅ Có thể analytics: "80% user chọn opt_001_2 cho câu traffic_001"
- ✅ Shuffle không ảnh hưởng: ID luôn giữ nguyên

---

## 🎯 **QUY TẮC ID:**

| Loại | Format | Ví dụ |
|------|--------|-------|
| Text option | `opt_{qid}_{index}` | `opt_002_1`, `opt_002_2` |
| Image option | `img_{qid}_{index}` | `img_006_1`, `img_006_2` |
| Hotspot single | `hotspot_{qid}` | `hotspot_001` |
| Hotspot multi | `spot_{qid}_{index}` | `spot_010_1`, `spot_010_2` |
| Video | `vid_{qid}` | `vid_013` |
| Audio | `aud_{qid}` | `aud_015` |

**Quy tắc:**
- `qid`: 3 chữ số (001, 002, 010, 123)
- `index`: số thứ tự bắt đầu từ 1
- Prefix rõ ràng theo loại (opt, img, spot, vid, aud)

---

## 🧪 **TESTING:**

### **Test 1: MCQ với text_id**
```javascript
console.log('Testing MCQ...');
const quiz = new QuizEngine(window.quizData);
quiz.init('quiz-container');
// Click đáp án → Check console log có user_answer: "opt_001_1"
```

### **Test 2: Multi Hotspot với x_y_id**
```javascript
// Click các điểm → Submit
// Check results có: user_answer: ["spot_010_1", "spot_010_3"]
```

### **Test 3: Image Pair với image_id**
```javascript
// Ghép các cặp → Submit
// Check results có: user_answer: [["img_005_1", "img_005_4"]]
```

---

## 📝 **MIGRATION CHECKLIST:**

- [ ] Backup data cũ
- [ ] Update backend để generate IDs
- [ ] Test với 1 câu hỏi đơn giản (MCQ)
- [ ] Test tất cả question types
- [ ] Verify output results có IDs
- [ ] Update analytics/tracking code để dùng IDs
- [ ] Deploy lên production

---

## 🐛 **TROUBLESHOOTING:**

### **Lỗi: "Cannot read property 'text_id' of undefined"**

**Nguyên nhân:** Data vẫn dùng format cũ (string array)

**Fix:**
```javascript
// Thay vì:
"opt_array": ["Đáp án A", "Đáp án B"]

// Phải là:
"opt_array": [
  { "text_id": "opt_001_1", "text": "Đáp án A" },
  { "text_id": "opt_001_2", "text": "Đáp án B" }
]
```

---

### **Lỗi: "sol_array is not a function"**

**Nguyên nhân:** sol_array vẫn dùng index (0, 1, 2)

**Fix:**
```javascript
// Thay vì:
"sol_array": 0

// Phải là:
"sol_array": "opt_001_1"
```

---

### **Lỗi: "Cannot find element with data-id"**

**Nguyên nhân:** Thiếu ID trong data

**Fix:** Đảm bảo mọi option đều có ID:
- text_id cho text options
- image_id cho image options  
- x_y_id cho hotspots

---

## 📚 **TÀI LIỆU THAM KHẢO:**

- `DATA-FORMAT-WITH-IDS.md` - Chi tiết format data
- `local_datainput_with_ids.js` - Ví dụ 12 câu đầy đủ
- `BACKEND-INTEGRATION-GUIDE.md` - Hướng dẫn backend

---

## 💡 **BEST PRACTICES:**

1. **ID phải unique trong quiz**
   ```javascript
   // ✅ ĐÚNG
   { "text_id": "opt_001_1", "text": "..." }
   { "text_id": "opt_002_1", "text": "..." }
   
   // ❌ SAI - trùng ID
   { "text_id": "opt_001_1", "text": "..." }
   { "text_id": "opt_001_1", "text": "..." }
   ```

2. **ID consistent với question ID**
   ```javascript
   // ✅ ĐÚNG
   { "qid": "traffic_001", "opt_array": [{ "text_id": "opt_001_1" }]}
   
   // ❌ SAI - số không khớp
   { "qid": "traffic_001", "opt_array": [{ "text_id": "opt_002_1" }]}
   ```

3. **Dùng leading zeros**
   ```javascript
   // ✅ ĐÚNG
   opt_001_1, opt_002_1, opt_010_1
   
   // ❌ SAI - khó sort
   opt_1_1, opt_2_1, opt_10_1
   ```

---

## 🎉 **DONE!**

Sau khi update xong, quiz của bạn sẽ:
- ✅ Hoạt động với ID system
- ✅ Có output rõ ràng cho analytics
- ✅ Shuffle-safe
- ✅ Ready cho multi-language

**→ Happy quizzing!** 🚀
