# 🎯 Hướng dẫn Fix Quiz - Backend Wrapped Structure

## ✅ ĐÃ TÌM RA VẤN ĐỀ

**Backend wrap toàn bộ quiz data vào field `EachQuiz`:**

```javascript
// ❌ Cấu trúc SAI từ backend:
{
  main_game_id: "...",
  main_title: "...",
  EachQuiz: {                    ← OBJECT chứa toàn bộ quiz
    main_game_id: "...",         ← Lặp lại
    main_title: "...",
    EachQuiz: [...]              ← Array câu hỏi thật
  }
}

// ✅ Cấu trúc ĐÚNG cần có:
{
  main_game_id: "...",
  main_title: "...",
  EachQuiz: [...]                ← Array câu hỏi
}
```

---

## 🔧 CÁCH 1: Fix JavaScript (KHUYÊN DÙNG - Không cần sửa Backend)

### **File đã update: `local_datainput_backend.js`**

File này đã được update tự động fix lỗi wrap! **Chỉ cần reload trang là xong.**

### **Hoặc thêm inline fix:**

Thêm đoạn này **SAU** `local_datainput_backend.js`:

```html
<script src="local_datainput_backend.js"></script>

<!-- Fix wrapped structure -->
<script>
if (window.quizData && window.quizData.EachQuiz && 
    typeof window.quizData.EachQuiz === 'object' && 
    !Array.isArray(window.quizData.EachQuiz)) {
    
    // Backend wrap sai: EachQuiz chứa toàn bộ quiz data
    if (window.quizData.EachQuiz.main_game_id && 
        window.quizData.EachQuiz.EachQuiz) {
        
        console.log('⚠️ Fixing wrapped structure...');
        window.quizData = window.quizData.EachQuiz;  // Unwrap
        console.log('✅ Fixed! Quiz ready.');
    }
}
</script>

<script src="local-quiz-complete.js"></script>
```

---

## 🔧 CÁCH 2: Fix Backend (TỐT NHẤT - Sửa gốc)

### **PHP/Laravel:**

```php
// ❌ HIỆN TẠI (SAI):
$output = [
    'main_game_id' => $quiz->id,
    'main_title' => $quiz->title,
    'EachQuiz' => $quizData  // ← Wrap toàn bộ quiz vào EachQuiz
];

$jsonString = json_encode($output);

// ✅ SỬA THÀNH:
// Cách 1: Truyền trực tiếp
$jsonString = json_encode($quizData);

// Cách 2: Hoặc nếu cần wrap
$jsonString = json_encode([
    'data' => $quizData
]);
// Rồi JS: window.quizData = JSON.parse(...).data;
```

### **Node.js/Express:**

```javascript
// ❌ HIỆN TẠI (SAI):
const output = {
    main_game_id: quiz.id,
    main_title: quiz.title,
    EachQuiz: quizData  // ← Wrap sai
};

// ✅ SỬA THÀNH:
// Truyền trực tiếp quizData
res.json(quizData);
```

### **Python/Django:**

```python
# ❌ HIỆN TẠI (SAI):
output = {
    'main_game_id': quiz.id,
    'main_title': quiz.title,
    'EachQuiz': quiz_data  # ← Wrap sai
}

# ✅ SỬA THÀNH:
# Truyền trực tiếp
output = quiz_data
```

---

## 🎯 Xác định backend đang dùng code nào

### **Tìm code backend:**

Tìm file PHP/JavaScript/Python xử lý route:
- Laravel: `app/Http/Controllers/QuizController.php`
- Node: `routes/quiz.js` hoặc `controllers/quizController.js`
- Django: `views.py`

### **Tìm dòng code gán `EachQuiz`:**

```php
// Tìm dòng này:
'EachQuiz' => ...

// Hoặc
$data['EachQuiz'] = ...

// Hoặc
array_merge(..., ['EachQuiz' => ...])
```

### **Check xem data truyền vào là gì:**

```php
// Debug
var_dump($quizData);
error_log(json_encode($quizData));

// Xem có phải toàn bộ quiz không
if (isset($quizData['main_game_id']) && 
    isset($quizData['EachQuiz'])) {
    // Đây là toàn bộ quiz rồi, không cần wrap
    echo json_encode($quizData);
} else {
    // Đây là array câu hỏi, cần build structure
}
```

---

## 📋 Checklist Fix Backend

- [ ] **1. Tìm controller/view xử lý quiz**
  - Laravel: `QuizController@show` hoặc `QuizController@get`
  - Node: Route `/api/quiz/:id`
  - Django: `quiz_view` function

- [ ] **2. Tìm dòng code gán EachQuiz**
  ```php
  'EachQuiz' => $quizData
  ```

- [ ] **3. Check `$quizData` chứa gì**
  ```php
  // Debug
  dd($quizData);  // Laravel
  console.log(quizData);  // Node
  print(quiz_data)  // Python
  ```

- [ ] **4. Nếu `$quizData` đã có cấu trúc đầy đủ:**
  ```php
  // Truyền trực tiếp, không wrap
  return response()->json($quizData);
  ```

- [ ] **5. Test lại**
  ```javascript
  // Console phải show:
  window.quizData.EachQuiz  // Array [...]
  Array.isArray(window.quizData.EachQuiz)  // true
  ```

---

## 🧪 Test sau khi fix

### **JavaScript Console:**

```javascript
console.log('=== TEST STRUCTURE ===');
console.log('1. Has main_game_id:', !!window.quizData.main_game_id);
console.log('2. Has EachQuiz:', !!window.quizData.EachQuiz);
console.log('3. EachQuiz is Array:', Array.isArray(window.quizData.EachQuiz));
console.log('4. EachQuiz length:', window.quizData.EachQuiz?.length);
console.log('5. First question:', window.quizData.EachQuiz?.[0]);

// All should be OK:
// 1. true
// 2. true
// 3. true
// 4. 5 (or number of questions)
// 5. {qn: 1, qtype: "hotspot", ...}
```

---

## 🚀 TÓM TẮT NHANH

### **Fix ngay (30 giây):**
1. File `local_datainput_backend.js` đã được update
2. Reload trang → Quiz sẽ chạy

### **Fix lâu dài (5 phút):**
1. Tìm backend code gán `EachQuiz`
2. Xóa wrap: Truyền `$quizData` trực tiếp thay vì wrap vào `EachQuiz`
3. Test lại

---

## ❓ Nếu không tìm được backend code

Gửi cho tôi:
1. Framework/Tech stack backend (Laravel? Node? Django?)
2. Route URL của quiz (VD: `/api/quiz/123`)
3. Screenshot file structure của backend

Tôi sẽ chỉ chính xác file cần sửa!

---

**Last Updated:** 2025-10-18  
**Version:** Final Fix - Wrapped Structure
