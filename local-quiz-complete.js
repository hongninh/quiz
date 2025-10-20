/**
 * LOCAL QUIZ JAVASCRIPT
 * File khởi tạo cho từng quiz cụ thể
 * Nhúng sau global-quiz.js và local_datainput.js
 */

// Lấy dữ liệu Quiz từ file local_datainput.js
// Biến window.quizData đã được define trong local_datainput.js
function getQuizData() {
    // Kiểm tra xem data đã được load chưa
    if (typeof window.quizData !== 'undefined' && window.quizData !== null) {
        console.log('✅ Quiz data found:', window.quizData.main_title);
        return window.quizData;
    }
    
    // Fallback: nếu chưa có, log error với thông tin debug
    console.error('❌ Quiz data chưa được load!');
    console.error('   Kiểm tra:');
    console.error('   1. File local_datainput.js đã được nhúng chưa?');
    console.error('   2. Nhúng đúng thứ tự: global-quiz.js → local_datainput.js → local-quiz-complete.js');
    console.error('   3. Đường dẫn file có đúng không?');
    console.error('   Debug: window.quizData =', window.quizData);
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
    // Delay một chút để đảm bảo tất cả scripts đã load
    setTimeout(initQuiz, 100);
}
