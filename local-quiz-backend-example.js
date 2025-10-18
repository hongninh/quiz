/**
 * LOCAL QUIZ JAVASCRIPT - BACKEND DATA VERSION
 * File khởi tạo quiz với dữ liệu từ backend
 * Nhúng sau global-quiz.js
 */

// ============================================================
// CÁCH 1: LẤY DATA TỪ DATA ATTRIBUTE (PHỔ BIẾN NHẤT)
// ============================================================
// Backend render: <div id="quiz-container" data-input='{"main_title":"Quiz ABC",...}'></div>

function initQuizFromDataAttribute() {
    const container = document.getElementById('quiz-container');
    
    // Lấy data từ attribute data-input
    const dataInput = container.getAttribute('data-input');
    
    if (!dataInput) {
        console.error('Không tìm thấy data-input attribute!');
        return;
    }
    
    try {
        // Parse JSON string thành object
        const quizData = JSON.parse(dataInput);
        
        // Khởi tạo quiz với data từ backend
        const quiz = new QuizEngine(quizData);
        quiz.init('quiz-container');
        
        console.log('✅ Quiz đã load thành công từ data-input attribute');
    } catch (error) {
        console.error('❌ Lỗi parse JSON từ data-input:', error);
    }
}


// ============================================================
// CÁCH 2: LẤY DATA TỪ BIẾN GLOBAL (Backend inline JavaScript)
// ============================================================
// Backend render: <script>var dataInput = {...};</script>

function initQuizFromGlobalVariable() {
    // Backend đã set biến global: window.dataInput hoặc var dataInput
    if (typeof dataInput === 'undefined' && typeof window.dataInput === 'undefined') {
        console.error('Không tìm thấy biến dataInput!');
        return;
    }
    
    // Lấy data từ biến global
    const quizData = window.dataInput || dataInput;
    
    // Khởi tạo quiz
    const quiz = new QuizEngine(quizData);
    quiz.init('quiz-container');
    
    console.log('✅ Quiz đã load thành công từ biến global dataInput');
}


// ============================================================
// CÁCH 3: LẤY DATA TỪ API (AJAX/Fetch)
// ============================================================

function initQuizFromAPI(quizId) {
    // Hiển thị loading
    const container = document.getElementById('quiz-container');
    container.innerHTML = '<div style="text-align:center;padding:50px;">Đang tải quiz...</div>';
    
    // Gọi API backend
    fetch(`/api/quiz/${quizId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(quizData => {
            // Khởi tạo quiz với data từ API
            const quiz = new QuizEngine(quizData);
            quiz.init('quiz-container');
            
            console.log('✅ Quiz đã load thành công từ API');
        })
        .catch(error => {
            console.error('❌ Lỗi khi load quiz từ API:', error);
            container.innerHTML = '<div style="text-align:center;padding:50px;color:red;">Không thể tải quiz. Vui lòng thử lại!</div>';
        });
}


// ============================================================
// TỰ ĐỘNG DETECT VÀ CHẠY PHƯƠNG THỨC PHÙ HỢP
// ============================================================

function autoInitQuiz() {
    const container = document.getElementById('quiz-container');
    
    if (!container) {
        console.error('❌ Không tìm thấy #quiz-container');
        return;
    }
    
    // Ưu tiên 1: Kiểm tra data-input attribute
    const dataInput = container.getAttribute('data-input');
    if (dataInput) {
        console.log('🔍 Phát hiện data từ data-input attribute');
        initQuizFromDataAttribute();
        return;
    }
    
    // Ưu tiên 2: Kiểm tra biến global
    if (typeof window.dataInput !== 'undefined') {
        console.log('🔍 Phát hiện data từ biến global window.dataInput');
        initQuizFromGlobalVariable();
        return;
    }
    
    // Ưu tiên 3: Kiểm tra quiz-id attribute để load từ API
    const quizId = container.getAttribute('data-quiz-id');
    if (quizId) {
        console.log('🔍 Phát hiện quiz-id, load từ API');
        initQuizFromAPI(quizId);
        return;
    }
    
    // Không tìm thấy data
    console.error('❌ Không tìm thấy dữ liệu quiz. Vui lòng cung cấp:');
    console.error('   - data-input attribute');
    console.error('   - window.dataInput variable');
    console.error('   - data-quiz-id attribute');
}


// ============================================================
// TỰ ĐỘNG KHỞI CHẠY KHI DOM SẴN SÀNG
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitQuiz);
} else {
    autoInitQuiz();
}


// ============================================================
// EXPORT FUNCTIONS (nếu cần gọi thủ công)
// ============================================================

window.QuizInit = {
    fromDataAttribute: initQuizFromDataAttribute,
    fromGlobalVariable: initQuizFromGlobalVariable,
    fromAPI: initQuizFromAPI,
    auto: autoInitQuiz
};
