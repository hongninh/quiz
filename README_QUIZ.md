# 📝 Quiz App - Hướng Dẫn Sử Dụng

## ✨ Tính năng

- ✅ Quiz trắc nghiệm đơn giản, không cần thư viện bên ngoài
- ✅ Giao diện đẹp, responsive (tương thích mobile)
- ✅ Hiệu ứng animation mượt mà
- ✅ Hiển thị kết quả chi tiết
- ✅ Tách biệt logic và dữ liệu (global_script.js & local_script.js)

## 📁 Cấu trúc files

```
quiz.html           - File HTML chính với CSS đẹp
global_script.js    - Logic quiz dùng chung (có thể tái sử dụng)
local_script.js     - Dữ liệu câu hỏi cho từng quiz cụ thể
```

## 🚀 Cách sử dụng

### 1. Chạy trực tiếp
- Mở file `quiz.html` bằng trình duyệt web
- Hoặc double-click vào file `quiz.html`

### 2. Xem trên GitHub Pages
- Push các files lên GitHub repository
- Kích hoạt GitHub Pages trong Settings
- Truy cập: `https://[username].github.io/[repo-name]/quiz.html`

### 3. Chạy với Local Server
```bash
# Python 3
python3 -m http.server 8000

# Node.js (nếu có npx)
npx serve

# Sau đó truy cập: http://localhost:8000/quiz.html
```

## 🎨 Tùy chỉnh Quiz

### Thay đổi câu hỏi

Chỉnh sửa file `local_script.js`:

```javascript
questions: [
    {
        question: "Câu hỏi của bạn?",
        answers: [
            "Đáp án A",
            "Đáp án B", 
            "Đáp án C",
            "Đáp án D"
        ],
        correctAnswer: 0  // Index của đáp án đúng (0 = A, 1 = B, 2 = C, 3 = D)
    }
]
```

### Thay đổi điểm đạt
```javascript
passPercentage: 60,  // Phần trăm để đạt (0-100)
```

### Thay đổi ngôn ngữ
```javascript
l10n: {
    nextButtonLabel: "Next question",
    finishButtonLabel: "Finish",
    retryButtonLabel: "Try again",
    correctText: "Correct!",
    incorrectText: "Incorrect!",
    // ... thêm các text khác
}
```

## 🔄 Tạo Quiz mới

1. Giữ nguyên `global_script.js` và `quiz.html`
2. Copy `local_script.js` thành file mới (vd: `local_script_2.js`)
3. Thay đổi câu hỏi trong file mới
4. Tạo HTML mới và đổi dòng import:
```html
<script src="local_script_2.js"></script>
```

## 🌟 Ưu điểm

- ✅ Không cần cài đặt gì
- ✅ Không cần kết nối internet (sau khi tải về)
- ✅ Không phụ thuộc thư viện bên ngoài
- ✅ Chạy được trên mọi trình duyệt hiện đại
- ✅ Dễ dàng tùy chỉnh và mở rộng
- ✅ Code sạch, dễ đọc, có comment đầy đủ

## 🎯 Ví dụ sử dụng

Quiz hiện tại có 5 câu hỏi về An toàn Lao động. Bạn có thể:
- Thêm/bớt câu hỏi
- Thay đổi chủ đề (toán, lịch sử, tiếng Anh, v.v.)
- Tạo nhiều quiz khác nhau cho từng môn học

## 🐛 Troubleshooting

**Q: Quiz không hiển thị?**
- Kiểm tra console (F12) xem có lỗi không
- Đảm bảo 3 files (HTML, global_script.js, local_script.js) ở cùng thư mục

**Q: Làm sao thêm hình ảnh vào câu hỏi?**
- Thêm HTML tag vào question:
```javascript
question: "Câu hỏi <img src='image.jpg' style='max-width:200px'> của bạn?"
```

**Q: Muốn hiển thị điểm trong lúc làm quiz?**
- Đổi `showScore: false` thành `showScore: true` trong `local_script.js`

---

Made with ❤️ - Pure JavaScript, No Dependencies!
