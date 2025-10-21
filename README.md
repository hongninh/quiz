# 🎯 Quiz Game - Đơn Giản với 2 Câu Hỏi

Quiz game đơn giản với CSS và JavaScript được đóng gói trên GitHub, Procfu.com chỉ cần gọi các file đó.

## 📁 Cấu trúc Files

```
CDN Quiz/
  ├── quiz.css        - File CSS (hosted trên GitHub)
  ├── quiz.js         - File JavaScript (hosted trên GitHub)
  └── procfu.html     - File HTML cho Procfu.com (chỉ gọi các file từ GitHub)
```

## 🚀 Hướng dẫn sử dụng

### Bước 1: Push code lên GitHub

```bash
git add "CDN Quiz/"
git commit -m "Add quiz game files in CDN Quiz folder"
git push origin main
```

### Bước 2: Sử dụng trên Procfu.com

Copy nội dung file `procfu.html` và paste vào Procfu.com. File này sẽ tự động load CSS và JavaScript từ GitHub qua CDN jsDelivr:

```html
<!-- CSS from GitHub -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hongninh/quiz@main/CDN%20Quiz/quiz.css">

<!-- JavaScript from GitHub -->
<script src="https://cdn.jsdelivr.net/gh/hongninh/quiz@main/CDN%20Quiz/quiz.js"></script>
```

### Bước 3: Test thử

1. Mở file `CDN Quiz/procfu.html` trong trình duyệt để test
2. Hoặc deploy trực tiếp trên Procfu.com

## ✨ Tính năng

- ✅ **2 câu hỏi** đơn giản về JavaScript và HTML
- ✅ Giao diện đẹp, responsive (tương thích mobile)
- ✅ Hiệu ứng animation mượt mà
- ✅ Hiển thị feedback ngay sau khi chọn đáp án
- ✅ Tính điểm tự động và hiển thị kết quả
- ✅ Có nút "Làm lại" để chơi lại

## 🎨 Tùy chỉnh

### Thay đổi câu hỏi

Chỉnh sửa file `CDN Quiz/quiz.js`, phần `quizData`:

```javascript
const quizData = {
    questions: [
        {
            question: "Câu hỏi của bạn?",
            answers: [
                "Đáp án A",
                "Đáp án B",
                "Đáp án C",
                "Đáp án D"
            ],
            correctAnswer: 0  // Index của đáp án đúng (0=A, 1=B, 2=C, 3=D)
        }
    ]
};
```

### Thêm câu hỏi

Thêm object mới vào mảng `questions`:

```javascript
{
    question: "Câu hỏi thứ 3?",
    answers: ["A", "B", "C", "D"],
    correctAnswer: 1
}
```

### Thay đổi màu sắc

Chỉnh sửa file `CDN Quiz/quiz.css`:

```css
/* Đổi màu gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Đổi màu nút */
.btn-primary {
    background: #667eea; /* Thay màu này */
}
```

## 🌐 CDN URLs

File CSS và JS được serve qua jsDelivr CDN:

- **CSS:** `https://cdn.jsdelivr.net/gh/hongninh/quiz@main/CDN%20Quiz/quiz.css`
- **JS:** `https://cdn.jsdelivr.net/gh/hongninh/quiz@main/CDN%20Quiz/quiz.js`

### Lưu ý về Cache

jsDelivr có cache, nếu bạn update code:

1. **Option 1:** Đợi vài phút để cache tự xóa
2. **Option 2:** Thêm version vào URL:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hongninh/quiz@main/CDN%20Quiz/quiz.css?v=2">
   ```
3. **Option 3:** Dùng commit hash cụ thể:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hongninh/quiz@abc1234/CDN%20Quiz/quiz.css">
   ```

## 🎯 Ưu điểm của cách làm này

- ✅ **Tách biệt rõ ràng:** Code (GitHub) và content (Procfu)
- ✅ **Dễ maintain:** Update code chỉ cần push GitHub, không cần sửa Procfu
- ✅ **CDN nhanh:** jsDelivr có server toàn cầu, load rất nhanh
- ✅ **Miễn phí:** Hoàn toàn free
- ✅ **Version control:** Git giúp quản lý version tốt

## 📱 Test Local

```bash
# Mở file procfu.html bằng trình duyệt
# Hoặc dùng live server
python3 -m http.server 8000
# Truy cập: http://localhost:8000/CDN%20Quiz/procfu.html
```

## 🐛 Troubleshooting

**Q: Quiz không hiển thị?**
- Kiểm tra console (F12) xem có lỗi không
- Đảm bảo đã push code lên GitHub
- Đợi 1-2 phút để jsDelivr cache lần đầu

**Q: Update code nhưng không thấy thay đổi?**
- Clear cache trình duyệt (Ctrl + Shift + R)
- Hoặc thêm `?v=2` vào cuối URL như hướng dẫn ở trên

**Q: Muốn dùng branch khác?**
- Đổi `@main` thành `@ten-branch` trong URL

---

Made with ❤️ - Hosted on GitHub, Powered by jsDelivr CDN!
