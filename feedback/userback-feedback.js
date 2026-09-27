// Quiz Feedback - Tích hợp Userback cho người kiểm thử (tester)
// Nhúng sau file quiz: tự tải widget Userback, gắn ngữ cảnh quiz
// (câu đang làm, game id, lỗi console...) vào mỗi phản hồi để dev đọc là hiểu ngay.
//
// Cấu hình (đặt TRƯỚC khi nhúng file này):
//   window.QUIZ_FEEDBACK = {
//       accessToken: 'USERBACK_ACCESS_TOKEN',   // bắt buộc - lấy trong Userback > Settings > Install
//       testerId: 'bot-01',                     // tuỳ chọn - hoặc truyền qua URL ?tester=bot-01
//       testerName: 'Bot kiểm thử 01',          // tuỳ chọn
//       testerEmail: 'bot01@example.com',       // tuỳ chọn
//       hideLauncher: false,                    // true = ẩn nút mặc định, tự gọi QuizFeedback.open()
//       onlyForTesters: false,                  // true = chỉ tải widget khi có tester id (học viên thật không thấy)
//       getContext: function () { return {}; }  // tuỳ chọn - thêm dữ liệu riêng của quiz
//   };

(function () {
    'use strict';

    const config = window.QUIZ_FEEDBACK || {};
    const MAX_ERRORS = 20;
    const recentErrors = [];

    // ===== Thu thập lỗi JS để đính kèm vào phản hồi =====
    function rememberError(message) {
        recentErrors.push({ time: new Date().toISOString(), message: String(message).slice(0, 500) });
        if (recentErrors.length > MAX_ERRORS) recentErrors.shift();
    }

    window.addEventListener('error', (event) => {
        rememberError(event.message + (event.filename ? ' @ ' + event.filename + ':' + event.lineno : ''));
    });
    window.addEventListener('unhandledrejection', (event) => {
        rememberError('Unhandled promise: ' + (event.reason && event.reason.message || event.reason));
    });

    const originalConsoleError = console.error;
    console.error = function () {
        rememberError(Array.prototype.map.call(arguments, String).join(' '));
        return originalConsoleError.apply(console, arguments);
    };

    // ===== Xác định người kiểm thử =====
    function readStorage(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    function writeStorage(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* private mode - bỏ qua */ }
    }

    function getTesterId() {
        const fromUrl = new URLSearchParams(window.location.search).get('tester');
        if (fromUrl) {
            writeStorage('quizFeedbackTester', fromUrl);
            return fromUrl;
        }
        return config.testerId || readStorage('quizFeedbackTester') || null;
    }

    // ===== Ngữ cảnh quiz tại thời điểm gửi phản hồi =====
    function textOf(id) {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : null;
    }

    function getQuizContext() {
        const data = window.quizData || {};
        const context = {
            page_url: window.location.href,
            page_title: document.title,
            game_id: data.main_game_id || null,
            game_title: data.main_title || null,
            question_number: textOf('question-number'),
            total_questions: textOf('total-questions'),
            question_text: textOf('question-text'),
            viewport: window.innerWidth + 'x' + window.innerHeight,
            user_agent: navigator.userAgent,
            tester_id: getTesterId(),
            recent_errors: recentErrors.slice()
        };

        if (typeof config.getContext === 'function') {
            try {
                Object.assign(context, config.getContext());
            } catch (e) {
                context.get_context_error = String(e);
            }
        }
        return context;
    }

    // ===== Tải widget Userback =====
    if (!config.accessToken) {
        console.warn('[QuizFeedback] Thiếu accessToken trong window.QUIZ_FEEDBACK - không tải Userback.');
    } else if (config.onlyForTesters && !getTesterId()) {
        // Người dùng thường - không hiện widget
    } else {
        const Userback = window.Userback = window.Userback || {};
        const testerId = getTesterId();

        Userback.access_token = config.accessToken;
        if (testerId) {
            Userback.user_data = {
                id: testerId,
                info: {
                    name: config.testerName || testerId,
                    email: config.testerEmail || undefined
                }
            };
        }
        Userback.custom_data = getQuizContext();

        // Cập nhật ngữ cảnh mới nhất mỗi khi tester mở form
        Userback.on_open = function () {
            if (typeof Userback.setData === 'function') {
                Userback.setData(getQuizContext());
            }
        };
        Userback.on_load = function () {
            if (config.hideLauncher && typeof Userback.hideLauncher === 'function') {
                Userback.hideLauncher();
            }
        };

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://static.userback.io/widget/v1.js';
        (document.head || document.body).appendChild(script);
    }

    // ===== API công khai =====
    window.QuizFeedback = {
        // type: 'bug' | 'general' | 'feature_request'; destination: 'screenshot' | 'video' | 'form'
        open: function (type, destination) {
            const Userback = window.Userback;
            if (!Userback) return false;
            if (typeof Userback.setData === 'function') Userback.setData(getQuizContext());

            const openFn = Userback.openForm || Userback.open;
            if (typeof openFn !== 'function') {
                console.warn('[QuizFeedback] Userback chưa tải xong.');
                return false;
            }
            openFn.call(Userback, type || 'bug', destination || 'screenshot');
            return true;
        },
        getContext: getQuizContext
    };
})();
