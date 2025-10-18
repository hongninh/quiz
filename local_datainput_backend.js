/**
 * LOCAL DATA INPUT - BACKEND VERSION
 * Nhận data từ backend qua biến my_variables
 * File này thay thế cho local_datainput.js khi dùng backend
 */

// Kiểm tra và parse data từ backend
if (typeof my_variables !== 'undefined' && my_variables.questions_and_answers_input_text_format) {
    try {
        // Parse JSON string thành object
        window.quizData = JSON.parse(my_variables.questions_and_answers_input_text_format);
        console.log('✅ Quiz data loaded from backend:', window.quizData.main_title);
        console.log('📊 Total questions:', window.quizData.main_total_questions);
        
        // FIX: Parse EachQuiz nếu nó là string
        if (window.quizData.EachQuiz && typeof window.quizData.EachQuiz === 'string') {
            console.log('⚠️ EachQuiz is string, parsing...');
            window.quizData.EachQuiz = JSON.parse(window.quizData.EachQuiz);
        }
        
        // Verify EachQuiz là array
        if (!Array.isArray(window.quizData.EachQuiz)) {
            console.error('❌ EachQuiz is not an array!');
            console.error('   Type:', typeof window.quizData.EachQuiz);
            console.error('   Value:', window.quizData.EachQuiz);
            window.quizData = null;
        } else {
            console.log('✅ EachQuiz loaded:', window.quizData.EachQuiz.length, 'questions');
        }
        
    } catch (error) {
        console.error('❌ Lỗi parse JSON:', error);
        console.error('   Raw data:', my_variables.questions_and_answers_input_text_format);
        window.quizData = null;
    }
} else {
    console.error('❌ Không tìm thấy my_variables.questions_and_answers_input_text_format');
    console.error('   Kiểm tra backend đã set biến này chưa');
    window.quizData = null;
}
