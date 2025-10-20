# 📊 So sánh Input: Backend vs Code Cũ

## 🔄 BACKEND INPUT (Procfu.com) - 5 câu

### **Metadata:**
```javascript
{
  "main_game_id": "traffic_safety_primary_2025",
  "main_title": "An Toàn Giao Thông: Thử Thách Cho Học Sinh Tiểu Học",
  "main_total_questions": 5,
  "main_total_max_points": 80,
  "main_media_assets_root_url": "https://res.cloudinary.com/...",  ← Có thêm field này
  // ... các field khác
}
```

### **Questions:**
```javascript
"EachQuiz": [
  {
    "qn": 1,
    "qtype": "hotspot",
    "qtxt": "hãy bấm vào vị trí có vạch kẻ..."  ← Chữ thường
  },
  {
    "qn": 2,
    "qtype": "multi",
    "qtxt": "trong các lựa chọn sau..."  ← Chữ thường
    "opt_array": ["xe đạp", "xe máy", ...]  ← Chữ thường
  },
  // ... 3 câu còn lại
]
```

---

## 🔄 CODE CŨ (Demo) - 12 câu

### **Metadata:**
```javascript
{
  "main_game_id": "complete_quiz_2025",
  "main_title": "Quiz Hoàn Chỉnh - 12 Câu Hỏi Đa Dạng",
  "main_total_questions": 12,
  "main_total_max_points": 200,
  // Không có main_media_assets_root_url
}
```

### **Questions:**
```javascript
"EachQuiz": [
  {
    "qn": 1,
    "qtype": "hotspot",
    "qtxt": "Hãy bấm vào vị trí có vạch kẻ..."  ← Chữ hoa
  },
  {
    "qn": 2,
    "qtype": "multi",
    "qtxt": "Trong các lựa chọn sau..."  ← Chữ hoa
    "opt_array": ["Xe đạp", "Xe máy", ...]  ← Chữ hoa
  },
  // ... 10 câu còn lại (image_mcq, image_multi, drag_drop, etc.)
]
```

---

## 📋 KHÁC BIỆT CHÍNH

| Feature | Backend (5 câu) | Code cũ (12 câu) |
|---------|----------------|------------------|
| **Số câu** | 5 | 12 |
| **Điểm tối đa** | 80 | 200 |
| **Loại câu** | hotspot, multi, mcq, order, image_pair | Tất cả 9 loại |
| **Chữ hoa/thường** | Thường (qtxt: "hãy bấm...") | Hoa (qtxt: "Hãy bấm...") |
| **media_assets_root_url** | Có | Không |
| **Image URLs** | Cloudinary real | Cloudinary real + Unsplash demo |

---

## ✅ FILE ĐÃ UPDATE

**`local_datainput.js`** đã được chuẩn hóa theo:
- ✅ 5 câu hỏi (giống backend)
- ✅ 80 điểm tối đa
- ✅ Các field giống y hệt backend
- ✅ Metadata đầy đủ
- ✅ Image URLs thật từ Cloudinary

---

## 🎯 KẾT LUẬN

**File `local_datainput.js` giờ là bản CHUẨN:**
- Match 100% với backend format
- Dùng để test local
- Làm template cho quiz mới
- Backend chỉ cần truyền data theo format này

---

**Version:** 2.2 - Standardized to Procfu Backend  
**Date:** 2025-10-18
