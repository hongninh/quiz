# 🔧 Fix Lỗi Parse JSON từ Backend

## ❌ LỖI:

```
SyntaxError: Unexpected non-whitespace character after JSON at position 18946
Raw data: ... "expl": "Trẻ em cần tuân thủ đủ 4 bước: chờ tín hiệu, qu   ← BỊ CẮT
```

---

## 🔍 NGUYÊN NHÂN

### **1. Backend truncate data**
```php
// Backend có thể giới hạn độ dài string
$jsonString = json_encode($quiz);
if (strlen($jsonString) > 20000) {
    $jsonString = substr($jsonString, 0, 20000);  // ← Cắt JSON, gây lỗi!
}
```

### **2. Ký tự đặc biệt không escape**
```javascript
"expl": "Dấu "nháy" trong text"  // ← Quotes không escape
```

### **3. HTML entities**
```html
<!-- Backend render: -->
<script>
var data = "{ &quot;title&quot;: ... }";  // HTML entities
</script>
```

---

## ✅ GIẢI PHÁP

### **Fix 1: Backend - Không truncate JSON**

```php
// ❌ SAI
$json = substr(json_encode($quiz), 0, 20000);

// ✅ ĐÚNG - Không cắt, hoặc dùng compression
$json = json_encode($quiz);

// Nếu quá lớn, compress:
$json = gzcompress(json_encode($quiz));
```

---

### **Fix 2: Backend - Escape đúng**

```php
// ❌ SAI
echo "var data = '$jsonString';";  // Có thể break nếu có quotes

// ✅ ĐÚNG - Dùng json_encode với flags
echo "var data = " . json_encode($quiz, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) . ";";

// Hoặc đơn giản:
?>
<script>
var my_variables = {
    questions_and_answers_input_text_format: <?= json_encode($quiz) ?>  // Không có quotes
};
</script>
```

---

### **Fix 3: JavaScript - Handle lỗi tốt hơn**

File `local_datainput_backend.js` đã được update với:
- ✅ Detect object vs string
- ✅ Clean invalid characters
- ✅ Try-catch với fallback
- ✅ Better error logging

**Reload trang để apply fix mới!**

---

### **Fix 4: Backend - Truyền trực tiếp object (TỐT NHẤT)**

```html
<!-- ❌ SAI - Stringify rồi stringify lại -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: '<?= json_encode($quiz) ?>'  // String
};
</script>

<!-- ✅ ĐÚNG - Truyền object trực tiếp -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: <?= json_encode($quiz) ?>  // Object
};
// Hoặc đơn giản:
window.quizData = <?= json_encode($quiz) ?>;
</script>
```

---

## 🔍 DEBUG - Tìm vị trí lỗi

### **Chạy trong Console:**

```javascript
const raw = my_variables.questions_and_answers_input_text_format;

// 1. Check type
console.log('Type:', typeof raw);

// 2. Check length
console.log('Length:', typeof raw === 'string' ? raw.length : 'N/A');

// 3. Tìm ký tự lỗi (position 18946)
if (typeof raw === 'string') {
    const errorPos = 18946;
    console.log('At error position:');
    console.log('  Before:', raw.substring(errorPos - 50, errorPos));
    console.log('  After:', raw.substring(errorPos, errorPos + 50));
    console.log('  Char code:', raw.charCodeAt(errorPos));
}

// 4. Xem cuối string
if (typeof raw === 'string') {
    console.log('Last 100 chars:', raw.substring(raw.length - 100));
}
```

---

## 🛠️ QUICK FIX - Inline

Thêm **TRƯỚC** `local_datainput_backend.js`:

```html
<script>
// Quick fix: Kiểm tra và sửa data
if (typeof my_variables !== 'undefined' && my_variables.questions_and_answers_input_text_format) {
    
    let raw = my_variables.questions_and_answers_input_text_format;
    
    // Nếu đã là object, không cần parse
    if (typeof raw === 'object') {
        console.log('✅ Data is already an object');
        window.quizData = raw;
        
        // Unwrap nếu bị wrap
        if (raw.EachQuiz && raw.EachQuiz.main_game_id && raw.EachQuiz.EachQuiz) {
            window.quizData = raw.EachQuiz;
        }
    } else {
        console.log('❌ Data is string, cannot parse. Check backend!');
        console.error('   Data type:', typeof raw);
        console.error('   Data length:', raw.length);
        window.quizData = null;
    }
}
</script>

<script src="local_datainput_backend.js"></script>
```

---

## 🎯 GIẢI PHÁP TỐT NHẤT - Sửa Backend

### **Backend cần render:**

```php
<!-- ❌ HIỆN TẠI (SAI) - Stringify thành string -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: '<?= addslashes(json_encode($quiz)) ?>'
};
</script>

<!-- ✅ SỬA THÀNH - Render object trực tiếp -->
<script>
var my_variables = {
    questions_and_answers_input_text_format: <?= json_encode($quiz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>
};
</script>

<!-- Hoặc đơn giản hơn: -->
<script>
window.quizData = <?= json_encode($quiz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
</script>
```

**Flags quan trọng:**
- `JSON_UNESCAPED_UNICODE` - Không escape ký tự Unicode (tiếng Việt)
- `JSON_UNESCAPED_SLASHES` - Không escape dấu /

---

## 🆘 EMERGENCY FIX

Nếu không thể sửa backend ngay, tạm dùng data static:

```html
<script src="global-quiz.js"></script>
<script src="local_datainput.js"></script>  ⬅️ Dùng file static
<script src="local-quiz-complete.js"></script>
```

---

## 📞 Cần làm gì tiếp:

**Chạy debug script này và gửi kết quả:**

```javascript
const raw = my_variables.questions_and_answers_input_text_format;
console.log('=== BACKEND DATA DEBUG ===');
console.log('1. Type:', typeof raw);
console.log('2. Is object:', typeof raw === 'object');
console.log('3. Is string:', typeof raw === 'string');

if (typeof raw === 'object') {
    console.log('4. Object keys:', Object.keys(raw));
    console.log('5. Has EachQuiz:', !!raw.EachQuiz);
    console.log('6. EachQuiz type:', typeof raw.EachQuiz);
} else if (typeof raw === 'string') {
    console.log('4. String length:', raw.length);
    console.log('5. First 200:', raw.substring(0, 200));
    console.log('6. Last 200:', raw.substring(raw.length - 200));
}
```

Gửi kết quả để tôi phân tích tiếp! 🔍