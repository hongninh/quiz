# Script tạo file quiz không lỗi syntax
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TẠO FILE QUIZ (FIX LỖI SYNTAX)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Xóa file cũ
Remove-Item "STANDALONE-QUIZ*.html" -ErrorAction SilentlyContinue
Remove-Item "my-quiz-fixed.html" -ErrorAction SilentlyContinue

Write-Host "⏳ Downloading..." -ForegroundColor Yellow

# Download với timestamp để force no-cache
$timestamp = (Get-Date).Ticks
$url = "https://raw.githubusercontent.com/hongninh/quiz/cursor/bc-abd464d3-8b48-4f0e-8587-740d52d1cbb5-6436/STANDALONE-QUIZ.html?t=$timestamp"

try {
    Invoke-WebRequest -Uri $url -OutFile "my-quiz-fixed.html" -Headers @{"Cache-Control"="no-cache"}
    Write-Host "✅ Download thành công!" -ForegroundColor Green
    
    # Check syntax error
    $content = Get-Content "my-quiz-fixed.html" -Raw
    if ($content -match [regex]::Escape("'✓' Đúng'")) {
        Write-Host "❌ File vẫn có lỗi syntax!" -ForegroundColor Red
        Write-Host "Có thể do CDN cache. Thử cách khác..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ File không có lỗi syntax!" -ForegroundColor Green
        Write-Host "📊 File size: $((Get-Item 'my-quiz-fixed.html').Length) bytes" -ForegroundColor Cyan
        Write-Host "✅ Có thể mở file!" -ForegroundColor Green
        Start-Process "my-quiz-fixed.html"
    }
} catch {
    Write-Host "❌ Lỗi download: $_" -ForegroundColor Red
}

Write-Host "`nNhấn Enter để thoát..."
Read-Host
