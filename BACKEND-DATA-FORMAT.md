# 📝 Chuẩn Data Format cho Backend Procfu.com

## ✅ CẤU TRÚC ĐÚNG (Đã test OK)

### **Structure chuẩn:**

```javascript
{
  // ========== METADATA CHÍNH ==========
  "main_game_id": "traffic_safety_primary_2025",
  "main_title": "An Toàn Giao Thông: Thử Thách Cho Học Sinh Tiểu Học",
  "main_description": "Bộ câu hỏi kiểm tra...",
  "main_project_id": "proj_hazard_2025",
  "main_game_version": "1.0.0",
  "main_author": "Traffic Safety Team",
  "main_age_array": [8, 9, 10, 11],
  "main_grade": "Primary",
  "main_total_questions": 5,
  "main_total_max_points": 80,
  "main_max_time_per_game_ms": 200000,
  "main_language": "vi",
  "main_theme": "traffic_safety",
  "main_difficulty_level": "mixed",
  "main_show_correct_answer_after_each_quiz": true,
  "main_shuffle_questions_order": false,
  "main_default_hint_allow": true,
  "main_default_hint_penalty_percent": 20,
  "main_feedback_mode": "detailed_explanation",
  "main_pass_threshold_percent": 70,
  "main_media_assets_root_url": "https://...",
  "main_status": "published",
  
  // ========== ARRAY CÂU HỎI ==========
  "EachQuiz": [
    {
      "qn": 1,
      "qid": "traffic_001",
      "qtype": "hotspot",
      "qtxt": "Hãy bấm vào vị trí có vạch kẻ...",
      "pmax": 10,
      "tmax": 30000,
      "diff": "easy",
      "fq": true,
      "lq": false,
      "opt_array": null,
      "sol_json": {"x": 200, "y": 250, "radius": 40},
      "expl": "Vạch kẻ trắng...",
      "tag_array": ["crosswalk", "pedestrian"],
      "image_json": ["https://..."],
      "display": "show",
      "display_correct_answer": "y",
      // ... các field khác
    },
    // ... câu 2, 3, 4, 5
  ]
}
```

---

## 📊 METADATA Fields (main_*)

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `main_game_id` | string | ✅ | "traffic_safety_primary_2025" |
| `main_title` | string | ✅ | "An Toàn Giao Thông..." |
| `main_description` | string | ✅ | "Bộ câu hỏi kiểm tra..." |
| `main_project_id` | string | ✅ | "proj_hazard_2025" |
| `main_game_version` | string | ✅ | "1.0.0" |
| `main_author` | string | ✅ | "Traffic Safety Team" |
| `main_age_array` | array | ✅ | [8, 9, 10, 11] |
| `main_grade` | string | ✅ | "Primary" |
| `main_total_questions` | number | ✅ | 5 |
| `main_total_max_points` | number | ✅ | 80 |
| `main_max_time_per_game_ms` | number | ✅ | 200000 |
| `main_language` | string | ✅ | "vi" |
| `main_theme` | string | ❌ | "traffic_safety" |
| `main_difficulty_level` | string | ❌ | "mixed" |
| `main_show_correct_answer_after_each_quiz` | boolean | ✅ | true |
| `main_shuffle_questions_order` | boolean | ✅ | false |
| `main_default_hint_allow` | boolean | ✅ | true |
| `main_default_hint_penalty_percent` | number | ✅ | 20 |
| `main_feedback_mode` | string | ✅ | "detailed_explanation" |
| `main_pass_threshold_percent` | number | ✅ | 70 |
| `main_media_assets_root_url` | string | ❌ | "https://..." |
| `main_status` | string | ✅ | "published" |

---

## 📝 QUESTION Fields (trong EachQuiz)

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `qn` | number | ✅ | 1 |
| `qid` | string | ✅ | "traffic_001" |
| `qtype` | string | ✅ | "hotspot" / "mcq" / "multi" / etc. |
| `qtxt` | string | ✅ | "Hãy bấm vào..." |
| `pmax` | number | ✅ | 10 |
| `tmax` | number | ✅ | 30000 |
| `diff` | string | ✅ | "easy" / "medium" / "hard" |
| `fq` | boolean | ✅ | true (first question) |
| `lq` | boolean | ✅ | false (last question) |
| `opt_array` | array/null | Depends | ["A", "B", "C"] hoặc null |
| `sol_array` | varies | ✅ | "A" hoặc ["A","B"] |
| `sol_json` | object/null | Depends | {"x":200,"y":250,"radius":40} |
| `expl` | string | ✅ | "Giải thích..." |
| `tag_array` | array | ✅ | ["crosswalk", "pedestrian"] |
| `image_json` | array/null | Depends | ["https://..."] |
| `image_total_number` | number | ✅ | 1 |
| `audio_json` | array/null | ❌ | null |
| `video_json` | array/null | ❌ | null |
| `opt_fmt` | string | ✅ | "image_only" / "text_only" / "image_text" |
| `media_placement` | string | ✅ | "background" / "above" / "inline" |
| `expl_fmt` | string | ✅ | "plain" |
| `display` | string | ✅ | "show" / "hide" |
| `display_correct_answer` | string | ✅ | "y" / "n" |
| `age` | string | ✅ | "8-11" |
| `grade` | string | ✅ | "primary" |
| `lang` | string | ✅ | "vi" |
| `author_id` | string | ✅ | "admin_001" |
| `project_id` | string | ✅ | "proj_hazard_2025" |
| `status` | string | ✅ | "active" |
| `version` | string | ✅ | "1.0" |
| `created_at` | string | ✅ | "2025-01-10T10:00:00Z" |
| `updated_at` | string | ✅ | "2025-01-10T10:00:00Z" |
| `is_private` | boolean | ✅ | false |
| `penalty_points` | number | ✅ | 0 |
| `min_points` | number | ✅ | 0 |
| `speed_bonus_eligible` | boolean | ✅ | true |
| `hint_allow` | boolean | ✅ | true |
| `hint_penalty_percent` | number | ✅ | 20 |
| `hint_content_text` | string/null | ❌ | "Tìm dấu hiệu..." |
| `hint_content_media` | string/null | ❌ | null |
| `shuf` | boolean | ✅ | false |
| `drag_items` | array/null | Depends | [...] (cho drag_drop) |
| `hotspot_array` | array/null | Depends | [...] (cho multi_hotspot) |

---

## 🎯 QUESTION TYPES

### **1. MCQ (Multiple Choice - 1 đáp án)**
```javascript
{
  "qtype": "mcq",
  "opt_array": ["A", "B", "C", "D"],
  "sol_array": "A"  // String
}
```

### **2. Multi (Multiple Choice - nhiều đáp án)**
```javascript
{
  "qtype": "multi",
  "opt_array": ["A", "B", "C", "D", "E"],
  "sol_array": ["A", "C", "E"]  // Array
}
```

### **3. Image MCQ**
```javascript
{
  "qtype": "image_mcq",
  "opt_array": [
    {"text": "Mũ bảo hiểm", "image": "https://..."},
    {"text": "Nón lá", "image": "https://..."}
  ],
  "sol_array": 0  // Index
}
```

### **4. Image Multi**
```javascript
{
  "qtype": "image_multi",
  "opt_array": [
    {"text": "Item 1", "image": "https://..."},
    {"text": "Item 2", "image": "https://..."}
  ],
  "sol_array": [0, 2, 3]  // Array of indexes
}
```

### **5. Hotspot (Click 1 điểm)**
```javascript
{
  "qtype": "hotspot",
  "opt_array": null,
  "sol_json": {
    "x": 200,
    "y": 250,
    "radius": 40
  },
  "image_json": ["https://..."]
}
```

### **6. Multi Hotspot (Click nhiều điểm)**
```javascript
{
  "qtype": "multi_hotspot",
  "hotspot_array": [
    {"id": "spot_1", "x": 25, "y": 30},
    {"id": "spot_2", "x": 50, "y": 40}
  ],
  "sol_array": ["spot_1", "spot_3"],
  "image_json": ["https://..."]
}
```

### **7. Order (Sắp xếp)**
```javascript
{
  "qtype": "order",
  "opt_array": ["Bước 1", "Bước 2", "Bước 3"],
  "sol_array": ["Bước 2", "Bước 1", "Bước 3"]  // Thứ tự đúng
}
```

### **8. Image Pair (Ghép cặp)**
```javascript
{
  "qtype": "image_pair",
  "opt_array": null,
  "sol_array": [[0, 0], [1, 1], [2, 2]],  // [safe_idx, danger_idx]
  "image_json": [
    "safe_1.jpg",   // 0
    "safe_2.jpg",   // 1
    "safe_3.jpg",   // 2
    "danger_1.jpg", // 3
    "danger_2.jpg", // 4
    "danger_3.jpg"  // 5
  ]
}
```

### **9. Drag & Drop**
```javascript
{
  "qtype": "drag_drop",
  "drag_items": [
    {
      "id": "item_1",
      "label": "Mặc đồ bảo hộ",
      "image": "https://...",
      "correct_zone": "safe"  // "safe" or "danger"
    }
  ]
}
```

---

## 🔄 Từ Backend → Frontend

### **Backend PHP:**
```php
$quizData = [
    'main_game_id' => 'quiz_001',
    'main_title' => 'Quiz Title',
    'main_total_questions' => 5,
    'main_total_max_points' => 80,
    'main_pass_threshold_percent' => 70,
    'EachQuiz' => [
        [
            'qn' => 1,
            'qtype' => 'mcq',
            'qtxt' => 'Question?',
            'opt_array' => ['A', 'B', 'C'],
            'sol_array' => 'A',
            // ... các field khác
        ],
        // ... câu 2, 3, 4, 5
    ]
];

// Render ra HTML
echo "<script>window.quizData = " . json_encode($quizData) . ";</script>";
```

### **Frontend nhận:**
```javascript
window.quizData = {
  main_game_id: "quiz_001",
  main_title: "Quiz Title",
  EachQuiz: [...]  // Array
};
```

---

## ⚠️ LỖI THƯỜNG GẶP

### **Lỗi 1: Backend wrap sai**
```php
// ❌ SAI
$output = [
    'EachQuiz' => $quizData  // Wrap toàn bộ vào EachQuiz
];

// ✅ ĐÚNG
$output = $quizData;  // Truyền trực tiếp
```

### **Lỗi 2: Stringify 2 lần**
```php
// ❌ SAI
$quiz['EachQuiz'] = json_encode($questions);  // Stringify lần 1
echo json_encode($quiz);                       // Stringify lần 2
// Result: EachQuiz = string "[...]"

// ✅ ĐÚNG
$quiz['EachQuiz'] = $questions;  // Giữ array
echo json_encode($quiz);         // Stringify toàn bộ
// Result: EachQuiz = array [...]
```

### **Lỗi 3: Thiếu required fields**
```javascript
// ❌ SAI - Thiếu fields
{
  "main_title": "...",
  "EachQuiz": [...]
}

// ✅ ĐÚNG - Đủ fields
{
  "main_game_id": "...",
  "main_title": "...",
  "main_total_questions": 5,
  "main_total_max_points": 80,
  "main_pass_threshold_percent": 70,
  "EachQuiz": [...]
}
```

---

## 🧪 Validate Data

### **JavaScript validator:**

```javascript
function validateQuizData(data) {
    const errors = [];
    
    // Check required metadata
    if (!data.main_game_id) errors.push('Missing main_game_id');
    if (!data.main_title) errors.push('Missing main_title');
    if (!data.main_total_questions) errors.push('Missing main_total_questions');
    if (!data.main_total_max_points) errors.push('Missing main_total_max_points');
    
    // Check EachQuiz
    if (!data.EachQuiz) {
        errors.push('Missing EachQuiz');
    } else if (!Array.isArray(data.EachQuiz)) {
        errors.push('EachQuiz is not an array');
    } else if (data.EachQuiz.length === 0) {
        errors.push('EachQuiz is empty');
    } else {
        // Check each question
        data.EachQuiz.forEach((q, i) => {
            if (!q.qn) errors.push(`Q${i+1}: Missing qn`);
            if (!q.qtype) errors.push(`Q${i+1}: Missing qtype`);
            if (!q.qtxt) errors.push(`Q${i+1}: Missing qtxt`);
            if (!q.pmax) errors.push(`Q${i+1}: Missing pmax`);
        });
    }
    
    if (errors.length > 0) {
        console.error('❌ Data validation failed:');
        errors.forEach(e => console.error('  -', e));
        return false;
    }
    
    console.log('✅ Data validation passed');
    return true;
}

// Sử dụng
if (validateQuizData(window.quizData)) {
    const quiz = new QuizEngine(window.quizData);
    quiz.init('quiz-container');
}
```

---

## 📋 Template tạo Quiz mới

```javascript
{
  // Metadata
  "main_game_id": "unique_quiz_id",
  "main_title": "Tiêu đề quiz",
  "main_description": "Mô tả quiz",
  "main_project_id": "project_id",
  "main_game_version": "1.0.0",
  "main_author": "Tên tác giả",
  "main_age_array": [8, 9, 10, 11],
  "main_grade": "Primary",
  "main_total_questions": 5,
  "main_total_max_points": 50,
  "main_max_time_per_game_ms": 180000,
  "main_language": "vi",
  "main_theme": "theme_name",
  "main_difficulty_level": "easy",
  "main_show_correct_answer_after_each_quiz": true,
  "main_shuffle_questions_order": false,
  "main_default_hint_allow": true,
  "main_default_hint_penalty_percent": 20,
  "main_feedback_mode": "detailed_explanation",
  "main_pass_threshold_percent": 70,
  "main_status": "published",
  
  // Câu hỏi
  "EachQuiz": [
    {
      "qn": 1,
      "qid": "q1",
      "qtype": "mcq",
      "qtxt": "Câu hỏi?",
      "pmax": 10,
      "tmax": 30000,
      "diff": "easy",
      "fq": true,
      "lq": false,
      "opt_array": ["A", "B", "C", "D"],
      "sol_array": "A",
      "expl": "Giải thích",
      "tag_array": ["tag1"],
      "image_json": null,
      "image_total_number": 0,
      "audio_json": null,
      "video_json": null,
      "opt_fmt": "text_only",
      "media_placement": "above",
      "expl_fmt": "plain",
      "display": "show",
      "display_correct_answer": "y",
      "age": "8-11",
      "grade": "primary",
      "lang": "vi",
      "author_id": "admin",
      "project_id": "project_id",
      "status": "active",
      "version": "1.0",
      "created_at": "2025-01-10T10:00:00Z",
      "updated_at": "2025-01-10T10:00:00Z",
      "is_private": false,
      "penalty_points": 0,
      "min_points": 0,
      "speed_bonus_eligible": true,
      "hint_allow": true,
      "hint_penalty_percent": 20,
      "hint_content_text": "Hint text",
      "hint_content_media": null,
      "shuf": false
    }
    // ... câu 2, 3, 4, 5
  ]
}
```

---

## 🔒 Data Security

### **Sanitize trước khi render:**

```php
// PHP
$safeData = htmlspecialchars(json_encode($quizData), ENT_QUOTES, 'UTF-8');
echo "<script>window.quizData = {$safeData};</script>";
```

### **Validate sau khi nhận:**

```javascript
// JavaScript
if (validateQuizData(window.quizData)) {
    // OK, khởi chạy quiz
} else {
    // Error, hiển thị thông báo
}
```

---

**Last Updated:** 2025-10-18  
**Version:** 2.2 - Chuẩn hóa theo Procfu Backend
