/**
 * QUIZ GAME - GLOBAL JAVASCRIPT
 * Core engine và các hàm tiện ích dùng chung
 */

class QuizEngine {
    constructor(gameData) {
        this.gameData = gameData;
        this.questions = gameData.EachQuiz || [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalPoints = 0;
        this.maxPoints = gameData.main_total_max_points || 0;
        this.answers = [];
        this.quizResults = [];
        this.container = null;
        this.currentAnswer = null;
        this.currentQuestionStartTime = null;
        this.quizStartTime = null;
        this.streak = 0;
        this.cumulativeScore = 0;
        
        // Registry cho các question type handlers
        this.questionTypeHandlers = {};
    }

    /**
     * Đăng ký handler cho một loại câu hỏi
     * @param {string} qtype - Loại câu hỏi (mcq, multi, hotspot, etc.)
     * @param {object} handler - Object chứa render và attach methods
     */
    registerQuestionType(qtype, handler) {
        this.questionTypeHandlers[qtype] = handler;
    }

    /**
     * Khởi tạo quiz
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }
        this.quizStartTime = new Date();
        this.render();
    }

    /**
     * Render màn hình hiện tại
     */
    render() {
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.renderResults();
        }
    }

    /**
     * Render câu hỏi hiện tại
     */
    renderQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        const total = this.questions.length;
        const num = this.currentQuestionIndex + 1;
        
        // Bắt đầu đếm thời gian
        this.currentQuestionStartTime = new Date();

        // Lấy handler tương ứng
        const handler = this.questionTypeHandlers[q.qtype];
        if (!handler || !handler.render) {
            console.error(`No handler found for question type: ${q.qtype}`);
            return;
        }

        // Render câu hỏi
        const qHtml = handler.render(q);

        this.container.innerHTML = `
            <div class="quiz-container">
                ${num === 1 ? `<div class="quiz-header">
                    <h1 class="quiz-main-title">${this.gameData.main_title}</h1>
                    <p class="quiz-description">${this.gameData.main_description}</p>
                </div>` : ''}
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(num / total) * 100}%"></div>
                    </div>
                    <div class="progress-text">Câu ${num} / ${total} • ${q.pmax} điểm</div>
                </div>
                <div class="question-container">
                    <span class="question-type-badge">${this.getTypeLabel(q.qtype)}</span>
                    <h2 class="question-title">${q.qtxt}</h2>
                    ${qHtml}
                </div>
            </div>
        `;

        // Attach event listeners
        if (handler.attach) {
            handler.attach.call(this, q);
        }
    }

    /**
     * Lấy nhãn hiển thị cho loại câu hỏi
     */
    getTypeLabel(t) {
        const labels = {
            'mcq': 'Chọn 1 đáp án',
            'multi': 'Chọn nhiều đáp án',
            'image_mcq': 'Chọn 1 hình',
            'image_multi': 'Chọn nhiều hình',
            'hotspot': 'Click điểm',
            'multi_hotspot': 'Click nhiều điểm',
            'order': 'Sắp xếp',
            'image_pair': 'Ghép cặp',
            'drag_drop': 'Kéo thả'
        };
        return labels[t] || t;
    }

    /**
     * Hiển thị feedback sau khi trả lời
     */
    feedback(isCorrect, points, question, customMessage = '') {
        const endTime = new Date();
        const playTime = endTime - this.currentQuestionStartTime;
        const timeRemaining = (question.tmax || 0) - playTime;
        
        // Cập nhật điểm và streak
        if (isCorrect) {
            this.score++;
            this.streak++;
        } else {
            this.streak = 0;
        }
        this.totalPoints += points;
        this.cumulativeScore += points;
        
        // Lưu kết quả chi tiết
        this.quizResults.push({
            "qn": question.qn,
            "lq": question.lq,
            "qid": question.qid,
            "ts_start": this.currentQuestionStartTime.toISOString(),
            "ts_end": endTime.toISOString(),
            "pt": playTime,
            "ps": points,
            "ans": this.currentAnswer ? (this.currentAnswer.selected || this.currentAnswer.order || []) : [],
            "cor": isCorrect,
            "skip": false,
            "trem": Math.max(0, timeRemaining),
            "hint": false,
            "pen": isCorrect ? 0 : (question.penalty_points || 0),
            "cum": this.cumulativeScore,
            "streak": this.streak,
            "sol": question.sol_array || question.sol_json || [],
            "expl": question.expl || "",
            "show_sol": question.display_correct_answer === "y"
        });
        
        // Hiển thị feedback
        const message = customMessage || (isCorrect ? 'Chính xác! ✓' : 'Chưa chính xác! ✗');
        const feedbackHtml = `
            <div class="feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                <span class="feedback-icon">${isCorrect ? '✓' : '✗'}</span>
                <span>${message} (+${points} điểm)</span>
            </div>
            ${question.expl ? `<div class="explanation"><strong>💡</strong> ${question.expl}</div>` : ''}
        `;
        
        const qContainer = this.container.querySelector('.question-container');
        qContainer.insertAdjacentHTML('beforeend', feedbackHtml);
        
        // Thêm nút next
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-button';
        nextBtn.textContent = this.currentQuestionIndex < this.questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả';
        nextBtn.onclick = () => this.nextQuestion();
        qContainer.appendChild(nextBtn);
    }

    /**
     * Chuyển sang câu hỏi tiếp theo
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        this.render();
    }

    /**
     * Hiển thị kết quả cuối cùng
     */
    renderResults() {
        const total = this.questions.length;
        const percentage = Math.round((this.score / total) * 100);
        const passed = percentage >= (this.gameData.main_pass_threshold_percent || 70);
        const quizEndTime = new Date();
        const totalTime = quizEndTime - this.quizStartTime;
        
        // Tạo summary
        const skippedCount = this.quizResults.filter(r => r.skip).length;
        const avgTime = Math.round(totalTime / total);
        
        const finalOutput = {
            "main_game_id": this.gameData.main_game_id,
            "main_game_version": this.gameData.main_game_version,
            "main_author": this.gameData.main_author,
            "main_language": this.gameData.main_language,
            "main_total_questions": total,
            "main_total_points": this.maxPoints,
            "player_info": {
                "uid": "user_" + Math.random().toString(36).substr(2, 9),
                "sid": "session_" + Date.now(),
                "att": 1,
                "ua": navigator.userAgent,
                "ip": "hidden"
            },
            "quiz_results": this.quizResults,
            "summary": {
                "total_score": this.totalPoints,
                "max_score": this.maxPoints,
                "correct_count": this.score,
                "wrong_count": total - this.score - skippedCount,
                "skipped_count": skippedCount,
                "avg_time_per_question_ms": avgTime,
                "total_time_ms": totalTime,
                "completion_rate_percent": 100,
                "pass_status": passed ? "passed" : "failed",
                "percentage": percentage
            }
        };
        
        // Lưu vào console và localStorage
        console.log("📊 KẾT QUẢ QUIZ:", JSON.stringify(finalOutput, null, 2));
        localStorage.setItem('quiz_result_latest', JSON.stringify(finalOutput));
        window.quizFinalOutput = finalOutput;
        
        // Render màn hình kết quả
        this.container.innerHTML = `
            <div class="quiz-container results-container">
                <div class="results-header"><h2>🎯 Kết quả</h2></div>
                <div class="results-score">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" class="score-circle-bg"></circle>
                            <circle cx="50" cy="50" r="45" class="score-circle-fill" 
                                    style="stroke-dasharray: ${percentage * 2.827}, 282.7"></circle>
                        </svg>
                        <div class="score-text">
                            <div class="score-percentage">${percentage}%</div>
                            <div class="score-fraction">${this.score}/${total} câu</div>
                        </div>
                    </div>
                </div>
                <div class="results-message ${passed ? 'message-passed' : 'message-failed'}">
                    ${passed ? '🎉 Xuất sắc! Bạn đã đạt!' : '😔 Hãy thử lại nhé!'}
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 20px;">
                    <div><strong>Tổng điểm:</strong> ${this.totalPoints}/${this.maxPoints}</div>
                    <div style="font-size: 13px; color: #666; margin-top: 8px;">
                        Thời gian: ${Math.floor(totalTime/1000)}s | Trung bình: ${Math.floor(avgTime/1000)}s/câu
                    </div>
                </div>
                <button class="submit-button" onclick="QuizUtils.downloadResults()" 
                        style="background: #28a745; margin-bottom: 10px;">
                    📥 Tải kết quả JSON
                </button>
                <button class="submit-button" onclick="QuizUtils.copyResults()" 
                        style="background: #17a2b8; margin-bottom: 10px;">
                    📋 Copy kết quả
                </button>
                <button class="retry-button" onclick="location.reload()">🔄 Làm lại</button>
            </div>
        `;
    }
}

/**
 * Các hàm tiện ích dùng chung
 */
const QuizUtils = {
    /**
     * Download kết quả dưới dạng JSON
     */
    downloadResults: function() {
        if (!window.quizFinalOutput) {
            alert('Chưa có kết quả!');
            return;
        }
        const dataStr = JSON.stringify(window.quizFinalOutput, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quiz_result_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Đã tải file JSON!');
    },

    /**
     * Copy kết quả vào clipboard
     */
    copyResults: function() {
        if (!window.quizFinalOutput) {
            alert('Chưa có kết quả!');
            return;
        }
        const dataStr = JSON.stringify(window.quizFinalOutput, null, 2);
        navigator.clipboard.writeText(dataStr).then(() => {
            alert('✅ Đã copy kết quả JSON vào clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = dataStr;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Đã copy kết quả!');
        });
    }
};
