# 🎯 HƯỚNG DẪN SỬ DỤNG ADMIN TOOL - HOTSPOT CREATOR

## 📝 Giới thiệu

Admin Tool giúp bạn tạo câu hỏi Hotspot dễ dàng bằng cách click trực tiếp vào ảnh, không cần tính toán tọa độ thủ công!

## 🚀 Bắt đầu

### Bước 1: Mở công cụ

```bash
# Mở file trong trình duyệt
quiz-game/admin-hotspot-creator.html
```

Hoặc double-click vào file `admin-hotspot-creator.html`

---

## 📖 Hướng dẫn chi tiết

### 1. Upload ảnh

**Cách 1: Click để chọn**
- Click vào khu vực "📁 Upload hoặc kéo thả ảnh"
- Chọn file ảnh từ máy (JPG, PNG, WEBP)

**Cách 2: Kéo thả**
- Kéo file ảnh từ máy
- Thả vào khu vực upload

✅ **Kết quả:** Ảnh sẽ hiển thị ở panel bên trái

---

### 2. Chọn loại câu hỏi

#### 🎯 Hotspot (1 điểm đúng)
- Dùng cho câu hỏi có **1 điểm đúng duy nhất**
- Ví dụ: "Click vào vạch kẻ người đi bộ"
- Chỉ cho phép đặt 1 điểm

#### 🎯 Multi Hotspot (Nhiều điểm)
- Dùng cho câu hỏi có **nhiều điểm** (đúng và sai)
- Ví dụ: "Click vào tất cả các điểm nguy hiểm"
- Cho phép đặt nhiều điểm, mỗi điểm có thể đánh dấu đúng/sai

**Cách chọn:**
```
┌─────────────────────┬─────────────────────┐
│   Hotspot           │   Multi Hotspot     │
│  (1 điểm đúng)      │   (Nhiều điểm)      │
└─────────────────────┴─────────────────────┘
      ↑ Click để chọn loại câu hỏi
```

---

### 3. Đặt điểm trên ảnh

#### Với Hotspot:
1. Click vào vị trí đúng trên ảnh
2. Điểm màu xanh (✓) sẽ xuất hiện
3. Chỉ được đặt 1 điểm

#### Với Multi Hotspot:

**Bước 1: Chọn chế độ**
```
┌────────────────┬────────────────┐
│  ✓ Điểm đúng   │  ✗ Điểm sai    │
└────────────────┴────────────────┘
```

**Bước 2: Click để đặt điểm**
- Chế độ "Điểm đúng" → Click = điểm màu xanh (✓)
- Chế độ "Điểm sai" → Click = điểm màu đỏ (✗)

**Bước 3: Đặt nhiều điểm**
- Chuyển qua lại giữa 2 chế độ để đặt điểm đúng/sai
- Không giới hạn số điểm

---

### 4. Quản lý điểm

#### Danh sách điểm
Mỗi điểm hiển thị:
```
┌─────────────────────────────────────┐
│ 1 ✓ Đúng                            │
│     x: 25.5%, y: 30.2%              │
│                    [⇄] [✕]          │
└─────────────────────────────────────┘
     ↑       ↑        ↑   ↑
   Số TT  Trạng  Toggle Xóa
            thái
```

#### Thao tác:

**Toggle đúng/sai:**
- Click nút [⇄] hoặc click trực tiếp vào điểm trên ảnh
- Điểm sẽ đổi màu: Xanh (✓) ↔ Đỏ (✗)

**Xóa điểm:**
- Click nút [✕]
- Xác nhận để xóa

**Xem thống kê:**
```
┌──────────┬──────────┬──────────┐
│  Tổng    │   Đúng   │   Sai    │
│    5     │    3     │    2     │
└──────────┴──────────┴──────────┘
```

---

### 5. Tạo JSON

#### Bước 1: Nhập thông tin câu hỏi

```
┌─────────────────────────────────────┐
│ Câu hỏi:                            │
│ ┌─────────────────────────────────┐ │
│ │ Click vào điểm nguy hiểm...     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Bước 2: Click "📋 Tạo JSON"

JSON sẽ được tạo tự động:

**Với Hotspot:**
```json
{
  "qtype": "hotspot",
  "qtxt": "Click vào điểm đúng trên hình",
  "pmax": 10,
  "image_json": ["data:image/..."],
  "sol_json": {
    "x": 400,
    "y": 300,
    "radius": 80
  },
  "expl": "Giải thích câu trả lời..."
}
```

**Với Multi Hotspot:**
```json
{
  "qtype": "multi_hotspot",
  "qtxt": "Click vào tất cả các điểm đúng",
  "pmax": 20,
  "image_json": ["data:image/..."],
  "hotspot_array": [
    { "id": "point_1", "x": 25.5, "y": 30.2 },
    { "id": "point_2", "x": 50.0, "y": 40.0 }
  ],
  "sol_array": ["point_1", "point_3"],
  "expl": "Giải thích câu trả lời..."
}
```

#### Bước 3: Click "📥 Copy JSON"

✅ JSON được copy vào clipboard!

---

### 6. Sử dụng JSON

#### Paste vào quiz data:

```javascript
const quizData = {
  "EachQuiz": [
    {
      "qn": 1,
      "qid": "q001",
      // ... Paste JSON ở đây
      "qtype": "hotspot",
      "qtxt": "Click vào điểm đúng...",
      // ...
    }
  ]
};
```

#### Lưu ý:
- Thay `"image_json": ["data:image/..."]` bằng URL ảnh thực tế
- Có thể chỉnh sửa `pmax` (điểm), `expl` (giải thích)

---

## 💡 Tips & Tricks

### 1. Làm việc hiệu quả

✅ **DO:**
- Upload ảnh chất lượng cao
- Đặt điểm chính xác
- Đặt tên câu hỏi rõ ràng
- Kiểm tra JSON trước khi dùng

❌ **DON'T:**
- Upload ảnh quá lớn (> 5MB)
- Đặt điểm quá gần nhau (khó click)
- Quên toggle đúng/sai

### 2. Shortcuts

| Phím tắt | Chức năng |
|----------|-----------|
| Click vào ảnh | Thêm điểm |
| Click vào điểm | Toggle đúng/sai |
| Ctrl+C | Copy JSON (sau khi tạo) |

### 3. Tối ưu điểm hotspot

**Khoảng cách tối thiểu:**
- Giữa 2 điểm: 10-15% kích thước ảnh
- Với bán kính mặc định (80px), điểm cách nhau ~100px

**Số lượng điểm:**
- Hotspot: 1 điểm
- Multi Hotspot: 
  - Tối thiểu: 2 điểm
  - Khuyến nghị: 3-7 điểm
  - Tối đa: Không giới hạn (nhưng nên < 10)

---

## 🐛 Xử lý lỗi

### Lỗi thường gặp:

#### 1. "Chưa có điểm nào!"
**Nguyên nhân:** Chưa click vào ảnh để đặt điểm  
**Giải pháp:** Click vào ảnh ít nhất 1 lần

#### 2. "Hotspot chỉ cho phép 1 điểm!"
**Nguyên nhân:** Đã đặt 1 điểm nhưng tiếp tục click  
**Giải pháp:** Chuyển sang Multi Hotspot hoặc xóa điểm cũ

#### 3. Ảnh không hiển thị
**Nguyên nhân:** File ảnh lỗi hoặc format không hỗ trợ  
**Giải pháp:** Dùng ảnh JPG, PNG, WEBP

#### 4. JSON không copy được
**Nguyên nhân:** Chưa tạo JSON  
**Giải pháp:** Click "Tạo JSON" trước

---

## 📊 Workflow đề xuất

```
1. Upload ảnh
   ↓
2. Chọn loại (Hotspot/Multi)
   ↓
3. Đặt điểm trên ảnh
   ↓
4. Kiểm tra & toggle nếu cần
   ↓
5. Nhập câu hỏi
   ↓
6. Tạo JSON
   ↓
7. Copy & dùng
   ↓
8. [Xóa tất cả] → Làm câu mới
```

---

## 🎯 Ví dụ thực tế

### Ví dụ 1: Câu hỏi an toàn giao thông

**Mục tiêu:** Tìm vạch kẻ người đi bộ

**Các bước:**
1. Upload ảnh đường phố
2. Chọn "Hotspot"
3. Click vào vạch kẻ trắng
4. Nhập câu hỏi: "Click vào vạch kẻ dành cho người đi bộ"
5. Tạo JSON → Copy → Dùng ✅

---

### Ví dụ 2: Tìm điểm nguy hiểm

**Mục tiêu:** Tìm tất cả điểm nguy hiểm trên công trường

**Các bước:**
1. Upload ảnh công trường
2. Chọn "Multi Hotspot"
3. Chọn "Điểm đúng" → Click vào các điểm nguy hiểm (3 điểm)
4. Chọn "Điểm sai" → Click vào các điểm an toàn (2 điểm)
5. Nhập câu hỏi: "Click vào tất cả điểm nguy hiểm"
6. Tạo JSON → Copy → Dùng ✅

---

## 🔗 Tích hợp với Quiz Game

### Copy JSON vào quiz:

```javascript
// File quiz data của bạn
const quizData = {
  "EachQuiz": [
    // ... câu hỏi khác
    
    // Paste JSON từ Admin Tool vào đây
    {
      "qn": 5,
      "qid": "safety_005",
      "qtype": "multi_hotspot",
      "qtxt": "Click vào tất cả các điểm nguy hiểm",
      "pmax": 20,
      "image_json": ["https://your-cdn.com/image.jpg"], // ← Thay bằng URL thực
      "hotspot_array": [
        { "id": "point_1", "x": 25.5, "y": 30.2 },
        { "id": "point_2", "x": 50.0, "y": 40.0 },
        { "id": "point_3", "x": 75.0, "y": 35.0 }
      ],
      "sol_array": ["point_1", "point_3"],
      "expl": "Điểm 1 và 3 là nguy hiểm vì..."
    }
  ]
};
```

---

## 📝 Checklist trước khi dùng

- [ ] Ảnh đã upload thành công
- [ ] Đã chọn đúng loại câu hỏi
- [ ] Đã đặt đủ điểm
- [ ] Điểm đúng/sai đã chính xác
- [ ] Câu hỏi đã nhập rõ ràng
- [ ] JSON đã được tạo
- [ ] Đã copy JSON
- [ ] Đã thay URL ảnh thực (nếu cần)

---

## 🎉 Hoàn thành!

Bây giờ bạn đã biết cách sử dụng Admin Tool để tạo câu hỏi Hotspot nhanh chóng!

**Có thắc mắc?** Xem lại tài liệu hoặc thử lại từng bước.

---

**Created:** 2025-10-14  
**Version:** 1.0  
**Tool:** admin-hotspot-creator.html
