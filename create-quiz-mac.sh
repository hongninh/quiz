#!/bin/bash
# Script tạo file quiz không lỗi syntax

echo "========================================"
echo "TẠO FILE QUIZ (FIX LỖI SYNTAX)"
echo "========================================"

# Xóa file cũ
rm -f STANDALONE-QUIZ*.html my-quiz-fixed.html

echo "⏳ Downloading..."

# Download với timestamp để force no-cache
timestamp=$(date +%s)
url="https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/STANDALONE-QUIZ.html?t=$timestamp"

if curl -H "Cache-Control: no-cache" -o "my-quiz-fixed.html" "$url"; then
    echo "✅ Download thành công!"
    
    # Check syntax error
    if grep -q "✓' Đúng'" my-quiz-fixed.html; then
        echo "❌ File vẫn có lỗi syntax!"
        echo "Có thể do CDN cache. Thử cách khác..."
    else
        echo "✅ File không có lỗi syntax!"
        ls -lh my-quiz-fixed.html
        echo "✅ Có thể mở file!"
        open my-quiz-fixed.html
    fi
else
    echo "❌ Lỗi download!"
fi
