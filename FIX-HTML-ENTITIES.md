# 🔧 Fix Lỗi HTML Entities trong JSON

## ❌ VẤN ĐỀ CHÍNH XÁC:

Backend truyền **STRING** có **HTML entities**:

```javascript
Type: string
Raw data: "...?w=400&amp;h=300&amp;fit=crop"
                    ^^^^^ HTML entity, không phải JSON hợp lệ
```

**Lỗi parse tại position 18946** vì có `&amp;` trong URL!

---

## ✅ GIẢI PHÁP NHANH (Copy ngay)

### **CÁCH 1: Inline Fix HTML Entities**

Thêm **TRƯỚC** `<script src="local_datainput_backend.js">`:

```html
<script>
// Decode HTML entities trong JSON string
if (typeof my_variables !== 'undefined' && 
    typeof my_variables.questions_and_answers_input_text_format === 'string') {
    
    console.log('⚠️ Decoding HTML entities...');
    
    // Tạo textarea để decode
    const textarea = document.createElement('textarea');
    textarea.innerHTML = my_variables.questions_and_answers_input_text_format;
    my_variables.questions_and_answers_input_text_format = textarea.value;
    
    console.log('✅ HTML entities decoded');
}
</script>

<script src="local_datainput_backend.js"></script>
```

---

### **CÁCH 2: Update file `local_datainput_backend.js`**

File đã được update tự động decode HTML entities!

**→ Reload trang là OK!**

---

### **CÁCH 3: Sửa Backend (TỐT NHẤT)**

```php
// ❌ HIỆN TẠI (SAI) - Backend HTML encode
<?php
$jsonString = json_encode($quiz);
$htmlEncoded = htmlspecialchars($jsonString);  // ← Tạo &amp;
?>
<script>
var my_variables = {
    questions_and_answers_input_text_format: '<?= $htmlEncoded ?>'
};
</script>

// ✅ SỬA THÀNH - KHÔNG encode, render trực tiếp
<?php
$jsonString = json_encode($quiz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
?>
<script>
var my_variables = {
    questions_and_answers_input_text_format: <?= $jsonString ?>  // ← Không có quotes, không encode
};
</script>

// Hoặc tốt hơn nữa:
<script>
window.quizData = <?= $jsonString ?>;  // Trực tiếp
</script>
```

---

## 🔍 Ví dụ HTML Entities gây lỗi:

```javascript
// ❌ JSON bị HTML encode:
{
  "url": "https://example.com?w=400&amp;h=300"    ← &amp; không hợp lệ trong JSON
  "text": "He said &quot;hello&quot;"              ← &quot; không hợp lệ
  "tag": "&lt;div&gt;"                             ← &lt; &gt; không hợp lệ
}

// ✅ JSON đúng:
{
  "url": "https://example.com?w=400&h=300"         ← & bình thường
  "text": "He said \"hello\""                       ← \" escape đúng
  "tag": "<div>"                                   ← < > bình thường (hoặc escape \u003c)
}
```

---

## 🛠️ BACKEND FIX CHI TIẾT

### **PHP/Laravel:**

```php
// ❌ SAI
$json = json_encode($quiz);
$encoded = htmlspecialchars($json);
echo "var data = '{$encoded}';";

// ✅ ĐÚNG - Option 1: Không encode
<?php
$json = json_encode($quiz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
<script>
window.quizData = <?= $json ?>;
</script>

// ✅ ĐÚNG - Option 2: Encode nhưng decode lại ở JS
<?php
$json = json_encode($quiz);
?>
<script>
const encoded = '<?= htmlspecialchars($json, ENT_QUOTES) ?>';
const textarea = document.createElement('textarea');
textarea.innerHTML = encoded;
window.quizData = JSON.parse(textarea.value);
</script>

// ✅ ĐÚNG - Option 3: Dùng Blade (Laravel)
<script>
window.quizData = @json($quiz);  // Laravel Blade tự động handle
</script>
```

---

### **Node.js/Express (EJS):**

```javascript
// ❌ SAI
<script>
var data = '<%- JSON.stringify(quiz) %>';  // <%- unescape HTML
</script>

// ✅ ĐÚNG
<script>
window.quizData = <%- JSON.stringify(quiz) %>;  // Không có quotes
</script>
```

---

### **Python/Django:**

```python
# ❌ SAI
<script>
var data = '{{ quiz_data|safe }}';
</script>

# ✅ ĐÚNG
<script>
window.quizData = {{ quiz_data|safe }};  // Không có quotes
</script>
```

---

## 🎯 QUICK TEST

**Chạy ngay trong Console:**

```javascript
// Test decode HTML entities
const encoded = my_variables.questions_and_answers_input_text_format;
const textarea = document.createElement('textarea');
textarea.innerHTML = encoded;
const decoded = textarea.value;

console.log('Before:', encoded.substring(18900, 19000));
console.log('After:', decoded.substring(18900, 19000));

// Parse thử
try {
    const parsed = JSON.parse(decoded);
    console.log('✅ Parse success!', parsed.main_title);
    
    // Unwrap nếu cần
    if (parsed.EachQuiz && parsed.EachQuiz.main_game_id && parsed.EachQuiz.EachQuiz) {
        window.quizData = parsed.EachQuiz;
    } else {
        window.quizData = parsed;
    }
    
    // Reload quiz
    const quiz = new QuizEngine(window.quizData);
    quiz.init('quiz-container');
    
} catch (e) {
    console.error('❌ Still failed:', e);
}
```

**→ Chạy code này là quiz sẽ chạy ngay!** 🚀

---

## 📋 Summary

**Nguyên nhân:** Backend HTML encode JSON string (`&` → `&amp;`)

**Fix:**
1. JavaScript decode HTML entities (file đã update)
2. Hoặc backend không encode (tốt hơn)

**Action:** Reload trang để apply fix mới!

---

**Thử reload trang và cho tôi biết kết quả!** 🔄