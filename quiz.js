// Quiz Game JavaScript - Hosted on GitHub
// Simple 2-question quiz

const quizData = {
    questions: [
        {
            question: "JavaScript là gì?",
            answers: [
                "Một ngôn ngữ lập trình",
                "Một loại cà phê",
                "Một hệ điều hành",
                "Một trình duyệt web"
            ],
            correctAnswer: 0
        },
        {
            question: "HTML là viết tắt của gì?",
            answers: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language"
            ],
            correctAnswer: 0
        }
    ]
};

class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.answers = [];
        this.init();
    }

    init() {
        this.showQuestion();
        this.setupEventListeners();
    }

    showQuestion() {
        const question = quizData.questions[this.currentQuestion];
        const questionSection = document.getElementById('question-section');
        const resultSection = document.getElementById('result-section');
        
        questionSection.classList.remove('hidden');
        resultSection.classList.add('hidden');

        document.getElementById('question-number').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = quizData.questions.length;
        document.getElementById('question-text').textContent = question.question;

        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.onclick = () => this.selectAnswer(index);
            answersContainer.appendChild(button);
        });

        this.selectedAnswer = null;
        this.updateButtons();
    }

    selectAnswer(index) {
        this.selectedAnswer = index;
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            btn.classList.remove('selected');
            if (i === index) {
                btn.classList.add('selected');
            }
        });
        this.updateButtons();
    }

    updateButtons() {
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = this.selectedAnswer === null;
    }

    nextQuestion() {
        if (this.selectedAnswer === null) return;

        const question = quizData.questions[this.currentQuestion];
        const isCorrect = this.selectedAnswer === question.correctAnswer;
        
        if (isCorrect) {
            this.score++;
        }

        this.answers.push({
            question: question.question,
            selected: this.selectedAnswer,
            correct: question.correctAnswer,
            isCorrect: isCorrect
        });

        // Show correct/incorrect feedback
        const buttons = document.querySelectorAll('.answer-btn');
        buttons[question.correctAnswer].classList.add('correct');
        if (!isCorrect) {
            buttons[this.selectedAnswer].classList.add('incorrect');
        }
        buttons.forEach(btn => btn.disabled = true);

        // Wait a bit before moving to next question
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < quizData.questions.length) {
                this.showQuestion();
            } else {
                this.showResults();
            }
        }, 1500);
    }

    showResults() {
        const questionSection = document.getElementById('question-section');
        const resultSection = document.getElementById('result-section');
        
        questionSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        const percentage = Math.round((this.score / quizData.questions.length) * 100);
        const passed = percentage >= 50;

        document.getElementById('score').textContent = `${this.score}/${quizData.questions.length}`;
        document.getElementById('percentage').textContent = `${percentage}%`;
        
        const messageEl = document.getElementById('result-message');
        if (passed) {
            messageEl.textContent = '🎉 Chúc mừng! Bạn đã đạt!';
            messageEl.className = 'result-message pass';
        } else {
            messageEl.textContent = '😔 Chưa đạt. Hãy thử lại!';
            messageEl.className = 'result-message fail';
        }
    }

    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.answers = [];
        this.showQuestion();
    }

    setupEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }
}

// Start the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});
