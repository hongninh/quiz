# 🔌 Hướng dẫn tích hợp với Backend Procfu.com

## ❌ Vấn đề gặp phải

**Log từ console:**
```
my_variables.questions_and_answers_input_text_format: {"main_game_id": "..."}
✅ Quiz data loaded: undefined
🚀 Khởi chạy quiz: undefined
```

**Nguyên nhân:** Backend truyền data dưới dạng **STRING JSON**, không phải object!

---

## ✅ GIẢI PHÁP

### **Cách 1: Parse JSON string (KHUYÊN DÙNG)**

Backend của bạn set:
```javascript
var my_variables = {
    questions_and_answers_input_text_format: '{"main_game_id":"...",...}'  // ← STRING
};
```

**Sửa trong `local_datainput.js`:**

```javascript
// ❌ SAI - Gán trực tiếp string
window.quizData = my_variables.questions_and_answers_input_text_format;

// ✅ ĐÚNG - Parse string thành object
window.quizData = JSON.parse(my_variables.questions_and_answers_input_text_format);
console.log('✅ Quiz data loaded:', window.quizData.main_title);
```

---

### **Cách 2: Dùng file local_datainput_backend.js (MỚI)**

Tôi đã tạo file mới **`local_datainput_backend.js`** xử lý sẵn:

```html
<!-- Thay thế local_datainput.js bằng: -->
<script src="global-quiz.js"></script>
<script src="local_datainput_backend.js"></script>    ⬅️ File mới, tự động parse
<script src="local-quiz-complete.js"></script>
```

**File này tự động:**
- Check `my_variables` có tồn tại không
- Parse JSON string thành object
- Handle lỗi nếu JSON invalid
- Log thông tin debug

---

### **Cách 3: Backend render object trực tiếp (TỐT NHẤT)**

**Thay đổi backend** để render object thay vì string:

```php
<!-- ❌ SAI - Backend render string -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: '<?php echo json_encode($quiz); ?>'
};
</script>

<!-- ✅ ĐÚNG - Backend render object -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: <?php echo json_encode($quiz); ?>  // ← Không có quotes
};
</script>

<!-- Hoặc đơn giản hơn: -->
<script>
window.quizData = <?php echo json_encode($quiz); ?>;  // ← Trực tiếp
</script>
```

---

## 🔍 Debug - Kiểm tra data type

Mở Console (F12) và chạy:

```javascript
// 1. Kiểm tra biến backend
console.log('Type:', typeof my_variables.questions_and_answers_input_text_format);

// Nếu là "string" → Cần parse
// Nếu là "object" → OK, không cần parse

// 2. Xem raw data
console.log('Raw:', my_variables.questions_and_answers_input_text_format);

// 3. Thử parse
try {
    const parsed = JSON.parse(my_variables.questions_and_answers_input_text_format);
    console.log('Parsed:', parsed);
    console.log('Title:', parsed.main_title);
} catch (e) {
    console.error('Parse error:', e);
}
```

---

## 📝 Code đầy đủ cho Procfu.com

### **HTML Template:**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quiz - Procfu.com</title>
    <link rel="stylesheet" href="/path/to/global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <!-- ============================================ -->
    <!-- BACKEND SET DATA (PHP) -->
    <!-- ============================================ -->
    <script>
    // Backend render data
    var my_variables = {
        // QUAN TRỌNG: Render object, không phải string
        questions_and_answers_input_text_format: <?php echo json_encode($quizData); ?>
    };
    
    // Assign vào window.quizData
    window.quizData = my_variables.questions_and_answers_input_text_format;
    
    // Debug
    console.log('✅ Data type:', typeof window.quizData);
    console.log('✅ Quiz title:', window.quizData?.main_title);
    </script>
    
    <!-- ============================================ -->
    <!-- LOAD QUIZ SCRIPTS -->
    <!-- ============================================ -->
    <script src="/path/to/global-quiz.js"></script>
    <!-- KHÔNG cần local_datainput.js vì đã có data ở trên -->
    <script src="/path/to/local-quiz-complete.js"></script>
</body>
</html>
```

---

## 🛠️ Fix nhanh (Temporary)

Nếu không thể sửa backend ngay, thêm đoạn này **trước** khi load `local-quiz-complete.js`:

```html
<script>
// Quick fix: Parse JSON string
if (typeof my_variables !== 'undefined' && 
    typeof my_variables.questions_and_answers_input_text_format === 'string') {
    
    console.log('⚠️ Detecting JSON string, parsing...');
    try {
        window.quizData = JSON.parse(my_variables.questions_and_answers_input_text_format);
        console.log('✅ Parsed successfully:', window.quizData.main_title);
    } catch (e) {
        console.error('❌ Parse failed:', e);
    }
} else {
    window.quizData = my_variables.questions_and_answers_input_text_format;
}
</script>

<script src="global-quiz.js"></script>
<script src="local-quiz-complete.js"></script>
```

---

## 📋 Checklist

- [ ] **1. Check data type trong console:**
  ```javascript
  typeof my_variables.questions_and_answers_input_text_format
  ```
  - Nếu `"string"` → Cần parse
  - Nếu `"object"` → OK

- [ ] **2. Nếu là string, thêm parse:**
  ```javascript
  window.quizData = JSON.parse(my_variables.questions_and_answers_input_text_format);
  ```

- [ ] **3. Hoặc sửa backend:**
  ```php
  // Bỏ quotes để render object
  questions_and_answers_input_text_format: <?php echo json_encode($quiz); ?>
  ```

- [ ] **4. Verify trong console:**
  ```javascript
  window.quizData.main_title  // Phải hiện title, không phải undefined
  ```

---

## 🎯 Kết quả mong đợi

**Console phải hiển thị:**
```
✅ Quiz data loaded: An Toàn Giao Thông: Thử Thách Cho Học Sinh Tiểu Học
🚀 Khởi chạy quiz: An Toàn Giao Thông: Thử Thách Cho Học Sinh Tiểu Học
📊 Total questions: 5
```

**KHÔNG được hiện:**
```
✅ Quiz data loaded: undefined   ← SAI
```

---

## 🆘 Nếu vẫn lỗi

Gửi cho team:
1. Screenshot console (F12)
2. Code HTML (phần set `my_variables`)
3. Run command này và gửi kết quả:
   ```javascript
   console.log('Debug info:');
   console.log('1. Type:', typeof my_variables.questions_and_answers_input_text_format);
   console.log('2. Value:', my_variables.questions_and_answers_input_text_format);
   console.log('3. First 100 chars:', my_variables.questions_and_answers_input_text_format?.substring(0, 100));
   ```

---

**Last Updated:** 2025-10-18  
**Version:** 2.1 - Procfu Backend Integration
