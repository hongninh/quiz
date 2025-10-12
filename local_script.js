/**
 * Local Quiz Script - Single Choice Question Data
 * This file contains page-specific question data and configuration
 * Customize this file for each quiz page
 */

// Quiz configuration and question data
const quizConfig = {
    // Quiz questions array
    questions: [
        {
            question: "Chọn tình huống nguy cơ khi làm việc với máy móc?",
            answers: [
                "Đeo đầy đủ thiết bị bảo hộ lao động",
                "Vận hành máy khi chưa được huấn luyện",
                "Kiểm tra máy móc trước khi sử dụng",
                "Báo cáo khi phát hiện máy móc hỏng hóc"
            ],
            correctAnswer: 1  // Index of correct answer (0-based, so 1 = answer B)
        },
        {
            question: "Hành động nào thể hiện an toàn lao động?",
            answers: [
                "Làm việc không cần nghỉ ngơi để hoàn thành sớm",
                "Tự ý sửa chữa thiết bị điện khi hỏng",
                "Tuân thủ quy trình an toàn lao động",
                "Bỏ qua các biển báo nguy hiểm"
            ],
            correctAnswer: 2
        },
        {
            question: "Khi xảy ra cháy nổ, bạn cần làm gì đầu tiên?",
            answers: [
                "Chạy về nhà lấy đồ đạc",
                "Kêu cứu và báo động khẩn cấp",
                "Chụp ảnh đăng lên mạng xã hội",
                "Đứng xem và quay video"
            ],
            correctAnswer: 1
        },
        {
            question: "Thiết bị bảo hộ nào BẮT BUỘC khi làm việc ở công trường xây dựng?",
            answers: [
                "Mũ bảo hiểm",
                "Tai nghe bluetooth",
                "Đồng hồ thông minh",
                "Kính thời trang"
            ],
            correctAnswer: 0
        },
        {
            question: "Biển báo nào chỉ thị nguy hiểm điện áp cao?",
            answers: [
                "Biển hình tròn màu xanh",
                "Biển hình tam giác màu vàng với hình tia chớp",
                "Biển hình vuông màu đỏ",
                "Biển hình chữ nhật màu trắng"
            ],
            correctAnswer: 1
        }
    ],

    // Pass percentage (0-100)
    passPercentage: 60,

    // Show current score while taking quiz
    showScore: false,

    // Localization strings
    l10n: {
        nextButtonLabel: "Câu tiếp theo",
        finishButtonLabel: "Hoàn thành",
        retryButtonLabel: "Làm lại",
        correctText: "Chính xác!",
        incorrectText: "Chưa chính xác!",
        resultsTitle: "Kết quả Quiz",
        reviewTitle: "Xem lại các câu hỏi",
        passedMessage: "🎉 Chúc mừng! Bạn đã vượt qua bài kiểm tra!",
        failedMessage: "😔 Bạn chưa đạt yêu cầu. Hãy thử lại nhé!"
    }
};

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initQuiz(quizConfig, 'quiz-container');
});
