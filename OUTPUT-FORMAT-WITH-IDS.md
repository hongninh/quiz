# 📊 Quiz Output Format với ID System

## 🎯 **MỤC ĐÍCH:**

Output format này giúp:
- ✅ Track chính xác user chọn option nào (bằng ID)
- ✅ Analytics chi tiết (phân tích theo ID)
- ✅ Backend dễ xử lý và lưu database
- ✅ Report đầy đủ và rõ ràng

---

## 📋 **CẤU TRÚC OUTPUT HOÀN CHỈNH:**

```json
{
  "main_game_id": "complete_quiz_2025",
  "main_title": "Quiz Hoàn Chỉnh - 12 Câu Hỏi Đa Dạng",
  "main_game_version": "1.0.0",
  "main_author": "Quiz Team",
  "main_language": "vi",
  "main_total_questions": 12,
  "main_total_max_points": 200,
  
  "player_info": {
    "uid": "user_y1xgtsas7",
    "sid": "session_1760368702618",
    "att": 1,
    "ua": "Mozilla/5.0 ...",
    "ip": "hidden"
  },
  
  "quiz_results": [
    {
      "qn": 1,
      "lq": false,
      "qid": "traffic_001",
      "qtype": "hotspot",
      "ts_start": "2025-10-13T15:16:35.147Z",
      "ts_end": "2025-10-13T15:16:38.455Z",
      "pt": 3308,
      "ps": 10,
      "ans": "hotspot_001",
      "ans_raw": { "x": 405, "y": 295, "clicked_id": "hotspot_001" },
      "cor": true,
      "skip": false,
      "trem": 26692,
      "hint": false,
      "pen": 0,
      "cum": 10,
      "streak": 1,
      "sol": "hotspot_001",
      "sol_raw": { "x_y_id": "hotspot_001", "x": 400, "y": 300, "radius": 80 },
      "show_sol": true
    },
    {
      "qn": 2,
      "lq": false,
      "qid": "traffic_002",
      "qtype": "multi",
      "ts_start": "2025-10-13T15:16:40.139Z",
      "ts_end": "2025-10-13T15:17:12.317Z",
      "pt": 32178,
      "ps": 15,
      "ans": ["opt_002_1", "opt_002_3"],
      "ans_raw": ["opt_002_1", "opt_002_3"],
      "cor": false,
      "skip": false,
      "trem": 7822,
      "hint": false,
      "pen": 0,
      "cum": 10,
      "streak": 0,
      "sol": ["opt_002_1", "opt_002_3", "opt_002_4"],
      "sol_raw": ["opt_002_1", "opt_002_3", "opt_002_4"],
      "show_sol": true
    }
  ],
  
  "summary": {
    "total_score": 185,
    "max_score": 200,
    "correct_count": 2,
    "wrong_count": 10,
    "skipped_count": 0,
    "avg_time_per_question_ms": 8956,
    "total_time_ms": 107471,
    "completion_rate_percent": 100,
    "pass_status": "failed",
    "percentage": 17
  }
}
```

---

## 🔑 **FIELDS GIẢI THÍCH:**

### **Top Level:**
| Field | Type | Mô tả |
|-------|------|-------|
| `main_game_id` | string | ID của quiz |
| `main_title` | string | Tiêu đề quiz |
| `main_game_version` | string | Version quiz |
| `main_author` | string | Tác giả |
| `main_language` | string | Ngôn ngữ (vi, en, ...) |
| `main_total_questions` | number | Tổng số câu hỏi |
| `main_total_max_points` | number | Tổng điểm tối đa |

### **Player Info:**
| Field | Type | Mô tả |
|-------|------|-------|
| `uid` | string | User ID (unique identifier) |
| `sid` | string | Session ID |
| `att` | number | Attempt number (lần chơi thứ mấy) |
| `ua` | string | User Agent (browser info) |
| `ip` | string | IP address (có thể hidden) |

### **Quiz Results (mỗi câu):**
| Field | Type | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `qn` | number | Question number | `1` |
| `lq` | boolean | Is last question | `false` |
| `qid` | string | Question ID | `"traffic_001"` |
| `qtype` | string | Question type | `"mcq"`, `"multi"`, `"hotspot"` |
| `ts_start` | string | Timestamp start (ISO) | `"2025-10-13T15:16:35.147Z"` |
| `ts_end` | string | Timestamp end (ISO) | `"2025-10-13T15:16:38.455Z"` |
| `pt` | number | Play time (ms) | `3308` |
| `ps` | number | Points for this question | `10` |
| **`ans`** | various | **User answer (IDs)** | `"opt_001_1"` hoặc `["opt_002_1"]` |
| `ans_raw` | various | User answer (raw format) | Full object/array |
| `cor` | boolean | Is correct | `true` / `false` |
| `skip` | boolean | Did user skip | `false` |
| `trem` | number | Time remaining (ms) | `26692` |
| `hint` | boolean | Did user use hint | `false` |
| `pen` | number | Penalty points | `0` |
| `cum` | number | Cumulative score | `10` |
| `streak` | number | Current streak | `1` |
| **`sol`** | various | **Correct answer (IDs)** | `"opt_001_1"` hoặc `["opt_002_1"]` |
| `sol_raw` | various | Correct answer (raw format) | Full object/array |
| `show_sol` | boolean | Show solution to user | `true` |

### **Summary:**
| Field | Type | Mô tả |
|-------|------|-------|
| `total_score` | number | Điểm đạt được |
| `max_score` | number | Điểm tối đa |
| `correct_count` | number | Số câu đúng |
| `wrong_count` | number | Số câu sai |
| `skipped_count` | number | Số câu bỏ qua |
| `avg_time_per_question_ms` | number | Thời gian TB/câu (ms) |
| `total_time_ms` | number | Tổng thời gian (ms) |
| `completion_rate_percent` | number | Tỷ lệ hoàn thành (%) |
| `pass_status` | string | `"passed"` hoặc `"failed"` |
| `percentage` | number | Phần trăm điểm (%) |

---

## 🎨 **ANS FORMAT THEO QUESTION TYPE:**

### **1. MCQ (Single Choice Text)**
```json
{
  "qtype": "mcq",
  "ans": "opt_003_1",
  "ans_raw": "opt_003_1",
  "sol": "opt_003_1",
  "sol_raw": "opt_003_1"
}
```

**Ý nghĩa:** User chọn option có ID `opt_003_1`

---

### **2. MULTI (Multiple Choice Text)**
```json
{
  "qtype": "multi",
  "ans": ["opt_002_1", "opt_002_3"],
  "ans_raw": ["opt_002_1", "opt_002_3"],
  "sol": ["opt_002_1", "opt_002_3", "opt_002_4"],
  "sol_raw": ["opt_002_1", "opt_002_3", "opt_002_4"]
}
```

**Ý nghĩa:** 
- User chọn 2 options: `opt_002_1` và `opt_002_3`
- Đáp án đúng là 3 options: `opt_002_1`, `opt_002_3`, `opt_002_4`
- → User thiếu 1 đáp án → SAI

---

### **3. IMAGE_MCQ (Single Choice Image)**
```json
{
  "qtype": "image_mcq",
  "ans": "img_006_1",
  "ans_raw": "img_006_1",
  "sol": "img_006_1",
  "sol_raw": "img_006_1"
}
```

**Ý nghĩa:** User chọn hình có ID `img_006_1`

---

### **4. IMAGE_MULTI (Multiple Choice Image)**
```json
{
  "qtype": "image_multi",
  "ans": ["img_008_1", "img_008_2"],
  "ans_raw": ["img_008_1", "img_008_2"],
  "sol": ["img_008_1", "img_008_2", "img_008_4"],
  "sol_raw": ["img_008_1", "img_008_2", "img_008_4"]
}
```

**Ý nghĩa:** User chọn 2 hình nhưng thiếu `img_008_4` → SAI

---

### **5. HOTSPOT (Click điểm)**
```json
{
  "qtype": "hotspot",
  "ans": "hotspot_001",
  "ans_raw": {
    "x": 405,
    "y": 295,
    "clicked_id": "hotspot_001"
  },
  "sol": "hotspot_001",
  "sol_raw": {
    "x_y_id": "hotspot_001",
    "x": 400,
    "y": 300,
    "radius": 80
  }
}
```

**Ý nghĩa:** 
- User click vào tọa độ (405, 295)
- Điểm đúng là (400, 300) với radius 80
- Distance = ~7px → ĐÚNG (trong radius)

---

### **6. MULTI_HOTSPOT (Click nhiều điểm)**
```json
{
  "qtype": "multi_hotspot",
  "ans": ["spot_010_1", "spot_010_3"],
  "ans_raw": ["spot_010_1", "spot_010_3"],
  "sol": ["spot_010_1", "spot_010_3", "spot_010_5"],
  "sol_raw": ["spot_010_1", "spot_010_3", "spot_010_5"]
}
```

**Ý nghĩa:** User chọn 2 điểm nhưng thiếu `spot_010_5` → SAI

---

### **7. ORDER (Sắp xếp)**
```json
{
  "qtype": "order",
  "ans": ["opt_004_2", "opt_004_1", "opt_004_3", "opt_004_4"],
  "ans_raw": ["opt_004_2", "opt_004_1", "opt_004_3", "opt_004_4"],
  "sol": ["opt_004_2", "opt_004_1", "opt_004_3", "opt_004_4"],
  "sol_raw": ["opt_004_2", "opt_004_1", "opt_004_3", "opt_004_4"]
}
```

**Ý nghĩa:** User sắp xếp đúng thứ tự → ĐÚNG

---

### **8. IMAGE_PAIR (Ghép cặp)**
```json
{
  "qtype": "image_pair",
  "ans": [
    ["img_005_1", "img_005_4"],
    ["img_005_2", "img_005_5"],
    ["img_005_3", "img_005_6"]
  ],
  "ans_raw": [
    ["img_005_1", "img_005_4"],
    ["img_005_2", "img_005_5"],
    ["img_005_3", "img_005_6"]
  ],
  "sol": [
    ["img_005_1", "img_005_4"],
    ["img_005_2", "img_005_5"],
    ["img_005_3", "img_005_6"]
  ]
}
```

**Ý nghĩa:** User ghép 3 cặp đúng → ĐÚNG

---

### **9. DRAG_DROP (Kéo thả)**
```json
{
  "qtype": "drag_drop",
  "ans": {
    "img_009_1": "safe",
    "img_009_2": "danger",
    "img_009_3": "safe",
    "img_009_4": "danger",
    "img_009_5": "safe",
    "img_009_6": "danger"
  },
  "ans_raw": {
    "img_009_1": "safe",
    "img_009_2": "danger",
    "img_009_3": "safe",
    "img_009_4": "danger",
    "img_009_5": "safe",
    "img_009_6": "danger"
  },
  "sol": null
}
```

**Ý nghĩa:** 
- User kéo 6 items vào đúng zones
- `img_009_1` → `safe`
- `img_009_2` → `danger`
- Check từng item xem có đúng `correct_zone` không

---

## 📊 **ANALYTICS SỬ DỤNG OUTPUT:**

### **1. Phân tích câu khó:**
```sql
SELECT 
  qid,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN cor = true THEN 1 ELSE 0 END) as correct_count,
  ROUND(100.0 * SUM(CASE WHEN cor = true THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM quiz_results
GROUP BY qid
ORDER BY success_rate ASC
LIMIT 10;
```

### **2. Phân tích đáp án bị chọn nhầm:**
```sql
-- MCQ: Đáp án nào bị chọn nhiều nhất (khi sai)
SELECT 
  qid,
  ans as wrong_answer,
  sol as correct_answer,
  COUNT(*) as times_chosen
FROM quiz_results
WHERE qtype = 'mcq' AND cor = false
GROUP BY qid, ans, sol
ORDER BY times_chosen DESC;
```

### **3. Phân tích thời gian:**
```sql
SELECT 
  qid,
  AVG(pt) as avg_time_ms,
  MIN(pt) as min_time_ms,
  MAX(pt) as max_time_ms
FROM quiz_results
GROUP BY qid
ORDER BY avg_time_ms DESC;
```

### **4. Phân tích user performance:**
```sql
SELECT 
  uid,
  COUNT(*) as total_questions,
  SUM(CASE WHEN cor = true THEN 1 ELSE 0 END) as correct_count,
  SUM(ps) as total_score,
  AVG(pt) as avg_time_per_question
FROM quiz_results
GROUP BY uid;
```

---

## 🔧 **BACKEND LƯU DATABASE:**

### **Table: `quiz_sessions`**
```sql
CREATE TABLE quiz_sessions (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(50) NOT NULL,
  sid VARCHAR(100) UNIQUE NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  total_score INT,
  max_score INT,
  percentage INT,
  pass_status VARCHAR(20),
  total_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW(),
  player_ua TEXT,
  player_ip VARCHAR(50)
);
```

### **Table: `quiz_answers`**
```sql
CREATE TABLE quiz_answers (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) REFERENCES quiz_sessions(sid),
  qn INT NOT NULL,
  qid VARCHAR(100) NOT NULL,
  qtype VARCHAR(50) NOT NULL,
  ans JSONB,
  ans_raw JSONB,
  sol JSONB,
  sol_raw JSONB,
  cor BOOLEAN NOT NULL,
  skip BOOLEAN DEFAULT false,
  pt INT,
  ps INT,
  trem INT,
  hint BOOLEAN DEFAULT false,
  pen INT DEFAULT 0,
  cum INT,
  streak INT,
  ts_start TIMESTAMP,
  ts_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX idx_quiz_answers_qid ON quiz_answers(qid);
CREATE INDEX idx_quiz_answers_cor ON quiz_answers(cor);
CREATE INDEX idx_quiz_answers_qtype ON quiz_answers(qtype);
CREATE INDEX idx_quiz_answers_ans ON quiz_answers USING GIN (ans);
```

---

## 📥 **CÁCH LẤY OUTPUT:**

### **1. Trong Console (tự động):**
```javascript
// Sau khi hoàn thành quiz, check console:
console.log(window.detailedQuizOutput);
```

### **2. Download JSON:**
```javascript
// Click button "Tải JSON" trên results screen
// Hoặc:
QuizUtils.downloadJSON();
```

### **3. Copy JSON:**
```javascript
// Click button "Copy JSON" trên results screen
// Hoặc:
QuizUtils.copyJSON();
```

### **4. Send to Backend:**
```javascript
// Tự động send sau khi quiz xong
fetch('/api/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(window.detailedQuizOutput)
}).then(response => response.json())
  .then(data => console.log('✅ Saved to backend:', data));
```

---

## 🎯 **EXAMPLE OUTPUT HOÀN CHỈNH:**

Xem file: `example-output-with-ids.json`

---

## ✅ **CHECKLIST:**

- [ ] Output có `ans` field với IDs
- [ ] Output có `sol` field với IDs
- [ ] MCQ: ans là string ID
- [ ] Multi: ans là array of string IDs
- [ ] Hotspot: ans là ID hoặc object
- [ ] Image pair: ans là array of pairs
- [ ] Drag drop: ans là object mapping
- [ ] Summary có đầy đủ metrics
- [ ] Player info có uid, sid
- [ ] Timestamps có định dạng ISO

---

**Last Updated:** 2025-10-18  
**Version:** 1.0.0 with ID System
