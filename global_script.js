/**
 * Global Quiz Script - Pure JavaScript Implementation
 * This file contains reusable quiz logic for single choice questions
 * No external dependencies required
 */

class QuizEngine {
    constructor(config) {
        this.config = config;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.container = null;
    }

    /**
     * Initialize the quiz
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Quiz container not found:', containerId);
            return;
        }
        this.render();
    }

    /**
     * Render the current state
     */
    render() {
        if (this.currentQuestionIndex < this.config.questions.length) {
            this.renderQuestion();
        } else {
            this.renderResults();
        }
    }

    /**
     * Render a single question
     */
    renderQuestion() {
        const question = this.config.questions[this.currentQuestionIndex];
        const totalQuestions = this.config.questions.length;
        const questionNumber = this.currentQuestionIndex + 1;

        const html = `
            <div class="quiz-container" role="main" aria-label="Quiz">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(questionNumber / totalQuestions) * 100}%"></div>
                    </div>
                    <div class="progress-text">Câu ${questionNumber} / ${totalQuestions}</div>
                </div>

                <div class="question-container">
                    <h2 class="question-title">${question.question}</h2>
                    
                    <div class="answers-container">
                        ${question.answers.map((answer, index) => `
                            <button 
                                class="answer-option" 
                                data-index="${index}"
                                aria-label="Answer option ${index + 1}"
                            >
                                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="answer-text">${answer}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                ${this.config.showScore ? `
                    <div class="current-score">
                        Điểm hiện tại: ${this.score} / ${this.currentQuestionIndex}
                    </div>
                ` : ''}
            </div>
        `;

        this.container.innerHTML = html;
        this.attachAnswerListeners();
    }

    /**
     * Attach click listeners to answer buttons
     */
    attachAnswerListeners() {
        const buttons = this.container.querySelectorAll('.answer-option');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => this.selectAnswer(index));
        });
    }

    /**
     * Handle answer selection
     */
    selectAnswer(answerIndex) {
        const question = this.config.questions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correctAnswer;
        
        // Store the answer
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            answerIndex: answerIndex,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        this.showFeedback(answerIndex, isCorrect);
    }

    /**
     * Show feedback for the selected answer
     */
    showFeedback(selectedIndex, isCorrect) {
        const buttons = this.container.querySelectorAll('.answer-option');
        const question = this.config.questions[this.currentQuestionIndex];
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        // Highlight selected answer
        buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Show correct answer if wrong
        if (!isCorrect) {
            buttons[question.correctAnswer].classList.add('correct');
        }

        // Show feedback message
        const feedbackHtml = `
            <div class="feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                <span class="feedback-icon">${isCorrect ? '✓' : '✗'}</span>
                <span class="feedback-text">${isCorrect ? this.config.l10n.correctText : this.config.l10n.incorrectText}</span>
            </div>
        `;

        const questionContainer = this.container.querySelector('.question-container');
        questionContainer.insertAdjacentHTML('beforeend', feedbackHtml);

        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = this.currentQuestionIndex < this.config.questions.length - 1 
            ? this.config.l10n.nextButtonLabel 
            : this.config.l10n.finishButtonLabel;
        nextButton.addEventListener('click', () => this.nextQuestion());
        questionContainer.appendChild(nextButton);
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        this.render();
    }

    /**
     * Render final results
     */
    renderResults() {
        const totalQuestions = this.config.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const passed = percentage >= this.config.passPercentage;

        const html = `
            <div class="quiz-container results-container">
                <div class="results-header">
                    <h2>${this.config.l10n.resultsTitle}</h2>
                </div>

                <div class="results-score">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" class="score-circle-bg"></circle>
                            <circle cx="50" cy="50" r="45" class="score-circle-fill" 
                                style="stroke-dasharray: ${percentage * 2.827}, 282.7"></circle>
                        </svg>
                        <div class="score-text">
                            <div class="score-percentage">${percentage}%</div>
                            <div class="score-fraction">${this.score} / ${totalQuestions}</div>
                        </div>
                    </div>
                </div>

                <div class="results-message ${passed ? 'message-passed' : 'message-failed'}">
                    ${passed ? this.config.l10n.passedMessage : this.config.l10n.failedMessage}
                </div>

                <div class="results-details">
                    <h3>${this.config.l10n.reviewTitle}</h3>
                    ${this.config.questions.map((question, index) => `
                        <div class="result-item ${this.answers[index].isCorrect ? 'result-correct' : 'result-incorrect'}">
                            <div class="result-question">
                                <span class="result-icon">${this.answers[index].isCorrect ? '✓' : '✗'}</span>
                                <span>Câu ${index + 1}: ${question.question}</span>
                            </div>
                            <div class="result-answer">
                                ${!this.answers[index].isCorrect ? `
                                    <div>Bạn chọn: <strong>${question.answers[this.answers[index].answerIndex]}</strong></div>
                                    <div>Đáp án đúng: <strong>${question.answers[question.correctAnswer]}</strong></div>
                                ` : `
                                    <div>Bạn đã chọn đúng: <strong>${question.answers[question.correctAnswer]}</strong></div>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="results-actions">
                    <button class="retry-button" onclick="location.reload()">
                        ${this.config.l10n.retryButtonLabel}
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }
}

// Global function to initialize quiz
function initQuiz(config, containerId = 'quiz-container') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const quiz = new QuizEngine(config);
            quiz.init(containerId);
        });
    } else {
        const quiz = new QuizEngine(config);
        quiz.init(containerId);
    }
}
