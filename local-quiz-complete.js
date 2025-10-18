/**
 * LOCAL QUIZ JAVASCRIPT
 * File khởi tạo cho từng quiz cụ thể
 * Nhúng sau global-quiz.js và local_datainput.js
 */

// Lấy dữ liệu Quiz từ file local_datainput.js
// Biến window.quizData đã được define trong local_datainput.js
function getQuizData() {
    // Kiểm tra xem data đã được load chưa
    if (typeof window.quizData !== 'undefined') {
        return window.quizData;
    }
    
    // Fallback: nếu chưa có, log error
    console.error('❌ Quiz data chưa được load. Hãy chắc chắn local_datainput.js đã được nhúng trước file này.');
    return null;
}

// Khởi chạy quiz khi DOM đã sẵn sàng
function initQuiz() {
    // Kiểm tra nếu QuizEngine đã được load
    if (typeof QuizEngine === 'undefined') {
        console.error('❌ QuizEngine chưa được load. Hãy chắc chắn rằng global-quiz.js đã được nhúng trước file này.');
        return;
    }

    // Lấy dữ liệu quiz từ local_datainput.js
    const quizData = getQuizData();
    
    if (!quizData) {
        console.error('❌ Không thể load quiz data. Kiểm tra lại local_datainput.js');
        return;
    }

    // Khởi tạo quiz engine với dữ liệu
    console.log('🚀 Khởi chạy quiz:', quizData.main_title);
    const quiz = new QuizEngine(quizData);
    
    // Khởi chạy quiz trong container có id="quiz-container"
    quiz.init('quiz-container');
}

// Tự động khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
