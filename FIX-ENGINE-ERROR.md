# 🔧 FIX LỖI: ❌ Engine: Not loaded

## 🎯 **VẤN ĐỀ:**
Khi mở `TEST-WITH-IDS-CORRECT.html` hiện lỗi: **❌ Engine: Not loaded**

---

## 🔍 **NGUYÊN NHÂN:**

Có 3 nguyên nhân chính:

### **1. Files không cùng folder** ⚠️
```
❌ SAI:
Downloads/
├── quiz-main/
│   └── TEST-WITH-IDS-CORRECT.html
└── quiz-files/
    ├── global-quiz-with-ids.js
    └── ...

✅ ĐÚNG:
Downloads/quiz/
├── TEST-WITH-IDS-CORRECT.html
├── global-quiz-with-ids.js        ← Cùng folder!
├── local_datainput_with_ids.js    ← Cùng folder!
├── local-quiz-complete.js         ← Cùng folder!
└── global-quiz.css                ← Cùng folder!
```

### **2. Browser chặn local files (CORS)** 🚫
Một số browser (đặc biệt Chrome) chặn load JavaScript từ local files vì lý do bảo mật.

### **3. File bị lỗi khi download** 💾
File ZIP có thể bị corrupt hoặc giải nén không đầy đủ.

---

## ✅ **GIẢI PHÁP:**

### **🔧 Solution 1: Check Folder Structure**

**Bước 1:** Giải nén ZIP

**Bước 2:** Check tất cả files sau có cùng folder:
```
✅ TEST-WITH-IDS-CORRECT.html
✅ DEBUG-TEST.html
✅ global-quiz.css
✅ global-quiz-with-ids.js
✅ local_datainput_with_ids.js
✅ local-quiz-complete.js
```

**Bước 3:** Mở `DEBUG-TEST.html` (file mới tôi vừa tạo)

**Bước 4:** Click "Run Check" để xem file nào bị lỗi

---

### **🔧 Solution 2: Check Console Errors**

**Bước 1:** Mở `TEST-WITH-IDS-CORRECT.html`

**Bước 2:** Nhấn **F12** (Windows) hoặc **Cmd+Opt+I** (Mac)

**Bước 3:** Chọn tab **Console**

**Bước 4:** Xem lỗi (màu đỏ). Các lỗi thường gặp:

#### **Lỗi A: File not found**
```
❌ Failed to load resource: net::ERR_FILE_NOT_FOUND
   global-quiz-with-ids.js
```

**Fix:** File không có trong folder. Download lại hoặc copy file vào cùng folder.

#### **Lỗi B: CORS policy**
```
❌ Access to script at 'file:///...' from origin 'null' 
   has been blocked by CORS policy
```

**Fix:** Dùng một trong các cách sau:
- Dùng **Firefox** (không block CORS)
- Dùng **Live Server** (xem bên dưới)
- Dùng **STANDALONE version** (không cần load file riêng)

#### **Lỗi C: Syntax error**
```
❌ Uncaught SyntaxError: Unexpected token
```

**Fix:** File bị lỗi. Download lại từ GitHub.

---

### **🔧 Solution 3: Dùng Browser Khác**

**Chrome** đôi khi chặn local files. Thử các browser sau:

| Browser | CORS Local Files | Recommended |
|---------|------------------|-------------|
| **Firefox** | ✅ Allow | ⭐⭐⭐⭐⭐ |
| **Edge** | ✅ Allow | ⭐⭐⭐⭐ |
| **Chrome** | ❌ Block | ⭐⭐ |
| **Safari** | ⚠️ Sometimes | ⭐⭐⭐ |

**Cách dùng Firefox:**
1. Install Firefox: https://www.mozilla.org/firefox/
2. Right-click `TEST-WITH-IDS-CORRECT.html` → Open with → Firefox
3. Hoạt động ngay!

---

### **🔧 Solution 4: Dùng Live Server** (RECOMMENDED)

**Live Server** giải quyết hoàn toàn vấn đề CORS.

#### **Option A: VS Code Live Server**

**Bước 1:** Install VS Code  
https://code.visualstudio.com/

**Bước 2:** Install extension "Live Server"
- Mở VS Code
- Click Extensions (Ctrl+Shift+X)
- Search "Live Server"
- Click Install

**Bước 3:** Mở folder quiz trong VS Code
- File → Open Folder
- Chọn folder chứa quiz files

**Bước 4:** Right-click `TEST-WITH-IDS-CORRECT.html`  
→ **Open with Live Server**

→ Browser tự động mở với địa chỉ `http://localhost:5500`

✅ **Hoạt động hoàn hảo!**

#### **Option B: Python Simple Server**

Nếu có Python installed:

```bash
# Mở terminal/cmd trong folder quiz
cd /path/to/quiz-folder

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Sau đó mở browser:
```
http://localhost:8000/TEST-WITH-IDS-CORRECT.html
```

#### **Option C: Node.js http-server**

Nếu có Node.js:

```bash
# Install
npm install -g http-server

# Run
cd /path/to/quiz-folder
http-server

# Mở browser
http://localhost:8080/TEST-WITH-IDS-CORRECT.html
```

---

### **🔧 Solution 5: Download Lại Files**

Nếu vẫn lỗi, có thể files bị corrupt.

#### **Download từng file riêng:**

**File 1: global-quiz-with-ids.js**
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz-with-ids.js
```

**File 2: local_datainput_with_ids.js**
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local_datainput_with_ids.js
```

**File 3: local-quiz-complete.js**
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/local-quiz-complete.js
```

**File 4: global-quiz.css**
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/global-quiz.css
```

**File 5: TEST-WITH-IDS-CORRECT.html**
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/TEST-WITH-IDS-CORRECT.html
```

**File 6: DEBUG-TEST.html** (file mới)
```bash
curl -O https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/DEBUG-TEST.html
```

Hoặc **Windows PowerShell:**
```powershell
$base = "https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436"
$files = @("global-quiz.css", "global-quiz-with-ids.js", "local_datainput_with_ids.js", "local-quiz-complete.js", "TEST-WITH-IDS-CORRECT.html", "DEBUG-TEST.html")

foreach ($f in $files) {
    Invoke-WebRequest -Uri "$base/$f" -OutFile $f
    Write-Host "✅ $f"
}
```

---

### **🔧 Solution 6: Dùng CDN (Online)**

Nếu không muốn dùng local files, dùng CDN:

**Tạo file `online-quiz-test.html`:**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quiz - CDN Version</title>
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

Mở file này sẽ load từ CDN (cần internet).

---

## 🔍 **DEBUG CHECKLIST:**

Làm theo thứ tự:

- [ ] **1. Check folder structure:** Tất cả files cùng folder?
- [ ] **2. Open DEBUG-TEST.html:** Run check để xem file nào lỗi
- [ ] **3. Open Console (F12):** Xem lỗi màu đỏ
- [ ] **4. Try Firefox:** Thử browser khác
- [ ] **5. Use Live Server:** Dùng VS Code Live Server
- [ ] **6. Download lại files:** Nếu vẫn lỗi

---

## ✅ **EXPECTED OUTPUT:**

Sau khi fix, mở `TEST-WITH-IDS-CORRECT.html` sẽ thấy:

```
✅ Engine: Loaded
✅ Data: Loaded
📦 Game ID: complete_quiz_2025
📊 Questions: 12
✅ IDs: Present!
🔑 Sample ID: opt_001_1
```

Console (F12) sẽ thấy:
```
QuizEngine: function
window.quizData: object
✅ All files loaded successfully!
```

---

## 📞 **VẪN CHƯA FIX ĐƯỢC?**

Nếu làm theo tất cả cách trên vẫn lỗi:

1. **Chụp màn hình Console (F12)** → Gửi tôi
2. **Check version browser** → Update browser mới nhất
3. **Thử download lại ZIP** → Có thể bị corrupt lần đầu
4. **Dùng CDN version** → Load từ online (solution 6)

---

## 🎯 **QUICKEST FIX (TOP 3):**

### **🥇 #1: Firefox Browser** (30 giây)
```
Download Firefox → Open HTML file → Done!
```

### **🥈 #2: VS Code Live Server** (2 phút)
```
Install VS Code → Install Live Server → Right-click HTML → Open with Live Server
```

### **🥉 #3: CDN Version** (1 phút)
```
Tạo file online-quiz-test.html với code trên → Mở → Done!
```

---

**✅ Làm theo một trong các cách trên là fix được lỗi!** 🚀

**Repository:** https://github.com/hongninh/quiz  
**Issue Tracker:** https://github.com/hongninh/quiz/issues
