/**
 * LOCAL DATA INPUT - BACKEND VERSION
 * Nhận data từ backend qua biến my_variables
 * File này thay thế cho local_datainput.js khi dùng backend
 */

// Kiểm tra và parse data từ backend
if (typeof my_variables !== 'undefined' && my_variables.questions_and_answers_input_text_format) {
    
    let rawData = my_variables.questions_and_answers_input_text_format;
    
    // FIX 1: Nếu backend truyền object thẳng (không phải string), dùng luôn
    if (typeof rawData === 'object' && rawData !== null) {
        console.log('✅ Backend data is object (not string), using directly');
        window.quizData = rawData;
        
        // FIX: Backend wrap sai cấu trúc
        if (window.quizData.EachQuiz && 
            typeof window.quizData.EachQuiz === 'object' && 
            !Array.isArray(window.quizData.EachQuiz)) {
            
            if (window.quizData.EachQuiz.main_game_id && window.quizData.EachQuiz.EachQuiz) {
                console.log('⚠️ Unwrapping nested structure...');
                window.quizData = window.quizData.EachQuiz;
            }
        }
        
        console.log('✅ Quiz loaded:', window.quizData.main_title);
        console.log('📊 Questions:', window.quizData.EachQuiz?.length);
        
    } else if (typeof rawData === 'string') {
        // FIX 2: Nếu là string, parse JSON
        console.log('⚠️ Backend data is string, parsing JSON...');
        
        try {
            // Clean string trước khi parse
            rawData = rawData.trim();
            
            // FIX: Decode HTML entities (&amp; → &, &quot; → ", etc.)
            const textarea = document.createElement('textarea');
            textarea.innerHTML = rawData;
            rawData = textarea.value;
            console.log('✅ HTML entities decoded');
            
            // Parse JSON
            window.quizData = JSON.parse(rawData);
            console.log('✅ Quiz data parsed:', window.quizData.main_title);
            
            // FIX: Backend wrap sai cấu trúc
            if (window.quizData.EachQuiz && 
                typeof window.quizData.EachQuiz === 'object' && 
                !Array.isArray(window.quizData.EachQuiz)) {
                
                if (window.quizData.EachQuiz.main_game_id && window.quizData.EachQuiz.EachQuiz) {
                    console.log('⚠️ Unwrapping nested structure...');
                    window.quizData = window.quizData.EachQuiz;
                }
            }
            
            console.log('📊 Questions loaded:', window.quizData.EachQuiz?.length);
            
        } catch (error) {
            console.error('❌ Lỗi parse JSON:', error);
            const errorPos = error.message.match(/position (\d+)/)?.[1];
            console.error('   Position:', errorPos);
            console.error('   Data length:', rawData.length);
            
            // Debug context around error
            if (errorPos) {
                const pos = parseInt(errorPos);
                console.error('   Context before:', rawData.substring(Math.max(0, pos - 50), pos));
                console.error('   Context after:', rawData.substring(pos, Math.min(rawData.length, pos + 50)));
            }
            
            console.error('   First 500 chars:', rawData.substring(0, 500));
            console.error('   Last 500 chars:', rawData.substring(rawData.length - 500));
            
            // Check if JSON is truncated
            const openBraces = (rawData.match(/\{/g) || []).length;
            const closeBraces = (rawData.match(/\}/g) || []).length;
            const openBrackets = (rawData.match(/\[/g) || []).length;
            const closeBrackets = (rawData.match(/\]/g) || []).length;
            
            console.error('   Brace balance: { =', openBraces, '} =', closeBraces, '(diff:', openBraces - closeBraces + ')');
            console.error('   Bracket balance: [ =', openBrackets, '] =', closeBrackets, '(diff:', openBrackets - closeBrackets + ')');
            
            if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
                console.error('   ⚠️ JSON IS TRUNCATED! Backend is cutting off data.');
                console.error('   📋 SOLUTION: Increase backend output buffer or use API endpoint.');
            }
            
            // Thử tìm và sửa lỗi JSON
            console.warn('⚠️ Attempting to fix JSON...');
            try {
                // Loại bỏ ký tự không hợp lệ
                const cleaned = rawData.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
                window.quizData = JSON.parse(cleaned);
                console.log('✅ Fixed and parsed successfully!');
            } catch (e2) {
                console.error('❌ Cannot fix JSON. Data is likely truncated.');
                console.error('   REQUIRED: Fix backend to output complete JSON or use API.');
                window.quizData = null;
            }
        }
    } else {
        console.error('❌ Invalid data type:', typeof rawData);
        window.quizData = null;
    }
    
    // Final verify
    if (window.quizData && !Array.isArray(window.quizData.EachQuiz)) {
        console.error('❌ Final check failed: EachQuiz is not an array!');
        console.error('   Type:', typeof window.quizData.EachQuiz);
        window.quizData = null;
    }
    
} else {
    console.error('❌ Không tìm thấy my_variables.questions_and_answers_input_text_format');
    window.quizData = null;
}
