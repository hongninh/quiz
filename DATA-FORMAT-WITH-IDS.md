# 📋 Quiz Data Format với ID System

## 🎯 MỤC ĐÍCH:

Thay vì dùng index (0, 1, 2) hoặc text trực tiếp, sử dụng **ID duy nhất** cho:
- ✅ Dễ quản lý khi shuffle câu trả lời
- ✅ Tránh nhầm lẫn khi text giống nhau
- ✅ Backend dễ tracking và analytics
- ✅ Hỗ trợ đa ngôn ngữ (text thay đổi nhưng ID không đổi)

---

## 📊 CẤU TRÚC CHI TIẾT:

### **1. Câu hỏi TEXT (MCQ, Multi, Order)**

```json
{
  "qn": 2,
  "qtype": "mcq",
  "qtxt": "Đèn đỏ nghĩa là gì?",
  "opt_array": [
    { "text_id": "opt_002_1", "text": "Dừng lại" },
    { "text_id": "opt_002_2", "text": "Đi chậm" },
    { "text_id": "opt_002_3", "text": "Được đi tiếp" },
    { "text_id": "opt_002_4", "text": "Rẽ phải" }
  ],
  "sol_array": "opt_002_1"
}
```

**Quy tắc ID:**
- Format: `opt_{qid}_{index}`
- `qid`: ID câu hỏi (VD: 002, 003)
- `index`: số thứ tự (1, 2, 3, ...)

---

### **2. Câu hỏi IMAGE (image_mcq, image_multi)**

```json
{
  "qn": 6,
  "qtype": "image_mcq",
  "qtxt": "Thiết bị nào bắt buộc khi đi xe đạp?",
  "opt_array": [
    { 
      "image_id": "img_006_1", 
      "text": "Mũ bảo hiểm xe đạp", 
      "image": "https://..." 
    },
    { 
      "image_id": "img_006_2", 
      "text": "Mũ thời trang", 
      "image": "https://..." 
    },
    { 
      "image_id": "img_006_3", 
      "text": "Nón lá", 
      "image": "https://..." 
    }
  ],
  "sol_array": "img_006_1"
}
```

**Quy tắc ID:**
- Format: `img_{qid}_{index}`
- Multiple correct: `"sol_array": ["img_006_1", "img_006_3"]`

---

### **3. Câu hỏi HOTSPOT (single hotspot)**

```json
{
  "qn": 1,
  "qtype": "hotspot",
  "qtxt": "Bấm vào vạch kẻ dành cho người đi bộ",
  "sol_json": { 
    "x_y_id": "hotspot_001",
    "x": 400, 
    "y": 300, 
    "radius": 80 
  }
}
```

**Quy tắc ID:**
- Format: `hotspot_{qid}`
- Single hotspot: ID trong `sol_json`

---

### **4. Câu hỏi MULTI HOTSPOT**

```json
{
  "qn": 10,
  "qtype": "multi_hotspot",
  "qtxt": "Click vào TẤT CẢ các điểm nguy hiểm",
  "hotspot_array": [
    { "x_y_id": "spot_010_1", "x": 25, "y": 30 },
    { "x_y_id": "spot_010_2", "x": 50, "y": 40 },
    { "x_y_id": "spot_010_3", "x": 75, "y": 35 },
    { "x_y_id": "spot_010_4", "x": 30, "y": 70 },
    { "x_y_id": "spot_010_5", "x": 65, "y": 75 }
  ],
  "sol_array": ["spot_010_1", "spot_010_3", "spot_010_5"]
}
```

**Quy tắc ID:**
- Format: `spot_{qid}_{index}`
- `sol_array` chứa danh sách ID đúng

---

### **5. Câu hỏi IMAGE PAIR (ghép cặp hình ảnh)**

```json
{
  "qn": 5,
  "qtype": "image_pair",
  "qtxt": "Ghép cặp hành động an toàn và nguy hiểm",
  "image_json": [
    { "image_id": "img_005_1", "image": "https://..." },
    { "image_id": "img_005_2", "image": "https://..." },
    { "image_id": "img_005_3", "image": "https://..." },
    { "image_id": "img_005_4", "image": "https://..." },
    { "image_id": "img_005_5", "image": "https://..." },
    { "image_id": "img_005_6", "image": "https://..." }
  ],
  "sol_array": [
    ["img_005_1", "img_005_4"],
    ["img_005_2", "img_005_5"],
    ["img_005_3", "img_005_6"]
  ]
}
```

**Quy tắc ID:**
- Format: `img_{qid}_{index}`
- `sol_array`: mỗi cặp là array 2 phần tử `[id1, id2]`

---

### **6. Câu hỏi DRAG & DROP**

```json
{
  "qn": 9,
  "qtype": "drag_drop",
  "qtxt": "Kéo thả hành động vào AN TOÀN hoặc NGUY CƠ",
  "drag_items": [
    { 
      "image_id": "img_009_1", 
      "label": "Mặc đồ bảo hộ", 
      "image": "https://...",
      "correct_zone": "safe" 
    },
    { 
      "image_id": "img_009_2", 
      "label": "Hút thuốc", 
      "image": "https://...",
      "correct_zone": "danger" 
    }
  ]
}
```

**Quy tắc ID:**
- Format: `img_{qid}_{index}`
- `correct_zone`: ID của zone đúng ("safe", "danger", etc.)

---

### **7. Câu hỏi VIDEO (nếu có)**

```json
{
  "qn": 13,
  "qtype": "video_mcq",
  "qtxt": "Xem video và trả lời",
  "video_json": {
    "video_id": "vid_013",
    "video": "https://..."
  },
  "opt_array": [
    { "text_id": "opt_013_1", "text": "Đáp án A" },
    { "text_id": "opt_013_2", "text": "Đáp án B" }
  ],
  "sol_array": "opt_013_1"
}
```

---

## 🎯 QUY TẮC CHUNG:

### **ID Naming Convention:**

| Loại | Format | Ví dụ |
|------|--------|-------|
| Text option | `opt_{qid}_{index}` | `opt_002_1` |
| Image option | `img_{qid}_{index}` | `img_006_3` |
| Hotspot single | `hotspot_{qid}` | `hotspot_001` |
| Hotspot multi | `spot_{qid}_{index}` | `spot_010_2` |
| Video | `vid_{qid}` | `vid_013` |
| Audio | `aud_{qid}` | `aud_015` |

### **Question ID (qid):**
- 3 chữ số có leading zero
- VD: `001`, `002`, `010`, `123`

---

## ✅ LỢI ÍCH:

1. **Shuffle-safe**: Có thể shuffle câu trả lời mà không ảnh hưởng đến kết quả
2. **Tracking**: Backend dễ track câu nào user chọn
3. **Analytics**: Phân tích câu nào bị chọn nhiều nhất
4. **Multi-language**: Giữ nguyên ID, chỉ thay text
5. **Debug**: Dễ debug khi có vấn đề (log ID thay vì index)

---

## 🔄 SO SÁNH CŨ vs MỚI:

### ❌ **CŨ (dùng index):**
```json
{
  "opt_array": ["A", "B", "C", "D"],
  "sol_array": 0  // ← Phải nhớ A là index 0
}
```

### ✅ **MỚI (dùng ID):**
```json
{
  "opt_array": [
    { "text_id": "opt_001_1", "text": "A" },
    { "text_id": "opt_001_2", "text": "B" },
    { "text_id": "opt_001_3", "text": "C" },
    { "text_id": "opt_001_4", "text": "D" }
  ],
  "sol_array": "opt_001_1"  // ← Rõ ràng là option A
}
```

---

## 🚀 IMPLEMENTATION:

File `local_datainput.js` đã được cập nhật với format mới này!

**Để test:** Reload trang và kiểm tra quiz có hoạt động bình thường không.

---

**Updated:** 2025-10-18
