# ✅ GIẢI PHÁP: Fix Lỗi "❌ Engine: Not loaded"

## 🎯 **BẠN GẶP LỖI GÌ?**

Khi mở `TEST-WITH-IDS-CORRECT.html` → Debug panel hiện:
```
❌ Engine: Not loaded
```

---

## 🚀 **3 GIẢI PHÁP NHANH (CHỌN 1):**

### **✅ SOLUTION 1: Dùng File CDN (EASIEST)** ⭐⭐⭐⭐⭐

**File này load từ internet, không cần lo CORS!**

**Bước 1:** Download file này:
```
https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/ONLINE-TEST-CDN.html
```

**Bước 2:** Mở file → **DONE!** ✅

**Hoặc** tạo file mới `online-test.html` với nội dung:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quiz Online Test</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hongninh/quiz@cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz.css">
</head>
<body>
    <div id="quiz-container"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz-with-ids.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local_datainput_with_ids.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local-quiz-complete.js"></script>
</body>
</html>
```

→ Mở file này → **Hoạt động ngay!** 🎉

---

### **✅ SOLUTION 2: Dùng Firefox Browser** ⭐⭐⭐⭐⭐

**Firefox không block local JS files.**

**Bước 1:** Download Firefox  
https://www.mozilla.org/firefox/

**Bước 2:** Right-click `TEST-WITH-IDS-CORRECT.html`

**Bước 3:** **Open with → Firefox**

→ **Hoạt động ngay!** ✅

---

### **✅ SOLUTION 3: Dùng VS Code Live Server** ⭐⭐⭐⭐

**Live Server giải quyết CORS hoàn toàn.**

**Bước 1:** Install VS Code  
https://code.visualstudio.com/

**Bước 2:** Install extension "Live Server"
- Mở VS Code
- Nhấn `Ctrl+Shift+X`
- Search "Live Server"
- Click "Install"

**Bước 3:** Open folder chứa quiz
- File → Open Folder
- Chọn folder quiz

**Bước 4:** Right-click `TEST-WITH-IDS-CORRECT.html`  
→ **Open with Live Server**

→ Browser tự mở: `http://localhost:5500`  
→ **Hoạt động hoàn hảo!** ✅

---

## 🔍 **DEBUG: Tìm Nguyên Nhân Lỗi**

### **Step 1: Check Folder Structure**

Tất cả files **PHẢI** ở cùng một folder:

```
quiz/
├── TEST-WITH-IDS-CORRECT.html     ← HTML file
├── global-quiz-with-ids.js        ← Engine (BẮT BUỘC!)
├── local_datainput_with_ids.js    ← Data (BẮT BUỘC!)
├── local-quiz-complete.js         ← Init (BẮT BUỘC!)
└── global-quiz.css                ← CSS (BẮT BUỘC!)
```

**❌ SAI:**
```
Downloads/
├── quiz-main/
│   └── TEST-WITH-IDS-CORRECT.html  ← HTML ở folder này
└── quiz-files/
    └── global-quiz-with-ids.js     ← JS ở folder khác → LỖI!
```

**✅ ĐÚNG:**
```
Downloads/quiz/
├── TEST-WITH-IDS-CORRECT.html      ← Cùng folder
├── global-quiz-with-ids.js         ← Cùng folder
├── local_datainput_with_ids.js     ← Cùng folder
└── ...
```

---

### **Step 2: Check Console Errors**

**Bước 1:** Mở `TEST-WITH-IDS-CORRECT.html`

**Bước 2:** Nhấn **F12** (hoặc Cmd+Opt+I trên Mac)

**Bước 3:** Tab **Console**

**Bước 4:** Xem lỗi (text màu đỏ)

#### **🔴 LỖI THƯỜNG GẶP:**

**Lỗi A: File not found**
```
❌ GET file:///C:/quiz/global-quiz-with-ids.js net::ERR_FILE_NOT_FOUND
```

**Nghĩa là:** File không có trong folder.

**Fix:** 
- Copy file `global-quiz-with-ids.js` vào cùng folder với HTML
- Hoặc download lại từ GitHub

---

**Lỗi B: CORS policy**
```
❌ Access to script at 'file:///...' from origin 'null' 
   has been blocked by CORS policy
```

**Nghĩa là:** Browser chặn load JS từ local files (bảo mật).

**Fix (chọn 1):**
1. **Dùng Firefox** (không block)
2. **Dùng Live Server** (VS Code)
3. **Dùng CDN version** (online)

---

**Lỗi C: QuizEngine is not defined**
```
❌ Uncaught ReferenceError: QuizEngine is not defined
```

**Nghĩa là:** File `global-quiz-with-ids.js` không load được.

**Fix:** Xem lại Lỗi A hoặc B ở trên.

---

## 📥 **DOWNLOAD FILES MỚI:**

### **Download từng file riêng:**

#### **File 1: ONLINE-TEST-CDN.html** (Recommended - Không lo CORS)
```
https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/ONLINE-TEST-CDN.html
```

#### **File 2: DEBUG-TEST.html** (Check lỗi)
```
https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/DEBUG-TEST.html
```

#### **File 3: TEST-WITH-IDS-CORRECT.html** (Cần 4 files khác)
```
https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/TEST-WITH-IDS-CORRECT.html
```

### **Download tất cả bằng command:**

**Bash/Mac/Linux:**
```bash
mkdir quiz-fixed && cd quiz-fixed

# Download 6 files
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/ONLINE-TEST-CDN.html
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/DEBUG-TEST.html
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/TEST-WITH-IDS-CORRECT.html
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz.css
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz-with-ids.js
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local_datainput_with_ids.js
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local-quiz-complete.js

# Test
open ONLINE-TEST-CDN.html
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Name "quiz-fixed"
Set-Location "quiz-fixed"

$base = "https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436"
$files = @(
    "ONLINE-TEST-CDN.html",
    "DEBUG-TEST.html", 
    "TEST-WITH-IDS-CORRECT.html",
    "global-quiz.css",
    "global-quiz-with-ids.js",
    "local_datainput_with_ids.js",
    "local-quiz-complete.js"
)

foreach ($f in $files) {
    Invoke-WebRequest -Uri "$base/$f" -OutFile $f
    Write-Host "✅ $f"
}

Start-Process "ONLINE-TEST-CDN.html"
```

---

## 🎯 **WHICH FILE TO OPEN?**

| File | Cần Files Khác? | Browser | Recommended |
|------|-----------------|---------|-------------|
| **ONLINE-TEST-CDN.html** | ❌ No (load từ CDN) | Any | ⭐⭐⭐⭐⭐ |
| **TEST-WITH-IDS-CORRECT.html** | ✅ Yes (4 files) | Firefox/Live Server | ⭐⭐⭐⭐ |
| **DEBUG-TEST.html** | ✅ Yes (4 files) | Any | ⭐⭐⭐ (debug) |

**Recommendation:**
1. **Mở `ONLINE-TEST-CDN.html` trước** → Easiest, no setup
2. Nếu muốn dùng local files → **Firefox** hoặc **Live Server**

---

## ✅ **CHECKLIST - LÀM THEO THỨ TỰ:**

- [ ] **1. Download ONLINE-TEST-CDN.html** (easiest)
- [ ] **2. Mở file → Check debug panel**
- [ ] **3. Nếu lỗi → Download Firefox → Open lại**
- [ ] **4. Nếu vẫn lỗi → Download DEBUG-TEST.html → Check lỗi**
- [ ] **5. Nếu vẫn lỗi → Install VS Code + Live Server**

---

## 📊 **EXPECTED OUTPUT:**

Sau khi fix, debug panel sẽ hiện:

```
✅ Engine: Loaded
✅ Data: Loaded
📦 Game ID: complete_quiz_2025
📊 Questions: 12
✅ IDs: Present!
🔑 Sample ID: opt_001_1
```

Console (F12):
```
QuizEngine: function
window.quizData: object
✅ All files loaded!
```

---

## 🆘 **VẪN CHƯA FIX?**

Nếu làm tất cả cách trên vẫn lỗi:

1. **Chụp màn hình Console (F12)** → Có lỗi màu đỏ không?
2. **Check browser version** → Update mới nhất
3. **Disable extensions** → Có thể extension chặn JS
4. **Try incognito mode** → Ctrl+Shift+N (Chrome) hoặc Ctrl+Shift+P (Firefox)

---

## 🔗 **LINKS:**

| Item | Link |
|------|------|
| **Download ZIP** | [Link](https://github.com/hongninh/quiz/archive/refs/heads/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436.zip) |
| **GitHub Repo** | https://github.com/hongninh/quiz |
| **View Files** | https://github.com/hongninh/quiz/tree/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436 |
| **CDN File** | [ONLINE-TEST-CDN.html](https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/ONLINE-TEST-CDN.html) |
| **Debug File** | [DEBUG-TEST.html](https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/DEBUG-TEST.html) |
| **Fix Guide** | [FIX-ENGINE-ERROR.md](https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/FIX-ENGINE-ERROR.md) |

---

## 🎉 **QUICKEST FIX (30 GIÂY):**

```
1. Download: ONLINE-TEST-CDN.html
2. Open file
3. Done! ✅
```

**Link:** https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/ONLINE-TEST-CDN.html

---

**✅ Làm theo một trong các cách là fix được!** 🚀

**Last Updated:** 2025-10-19  
**Commit:** b6e58a0
