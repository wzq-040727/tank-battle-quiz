import { builtInQuestions } from './questions.js';

const API_BASE = 'http://localhost:8080/api';

export class QuizModule {
    constructor() {
        this.currentQuestion = null;
        this.timer = 30;
        this.timerInterval = null;
        this.onAnswer = null;
        this.onContinue = null;
    }

    async triggerQuiz(difficulty) {
        try {
            const url = difficulty
                ? `${API_BASE}/questions/random?difficulty=${difficulty}`
                : `${API_BASE}/questions/random`;
            const res = await fetch(url);
            if (res.ok) {
                this.currentQuestion = await res.json();
            } else {
                this.currentQuestion = this.getRandomBuiltIn(difficulty);
            }
        } catch {
            this.currentQuestion = this.getRandomBuiltIn(difficulty);
        }
        this.showQuizUI();
    }

    getRandomBuiltIn(difficulty) {
        let pool = builtInQuestions;
        if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    showQuizUI() {
        const q = this.currentQuestion;
        document.getElementById('quiz-content').textContent = q.content;
        document.getElementById('quiz-category').textContent = `[${q.category}] ${q.difficulty}`;
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-options').classList.remove('hidden');

        const options = document.querySelectorAll('.quiz-option');
        options.forEach(btn => {
            btn.className = 'quiz-option';
            btn.disabled = false;
            const opt = btn.dataset.option;
            btn.textContent = `${opt}. ${q['option' + opt]}`;
        });

        document.getElementById('quiz-overlay').classList.remove('hidden');
        this.startTimer();
    }

    startTimer() {
        this.timer = 30;
        document.getElementById('quiz-timer').textContent = this.timer;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer--;
            document.getElementById('quiz-timer').textContent = this.timer;
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.handleAnswer(null);
            }
        }, 1000);
    }

    handleAnswer(selected) {
        clearInterval(this.timerInterval);
        const q = this.currentQuestion;
        const isCorrect = selected === q.answer;

        const options = document.querySelectorAll('.quiz-option');
        options.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.option === q.answer) btn.classList.add('correct');
            if (btn.dataset.option === selected && !isCorrect) btn.classList.add('wrong');
        });

        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('quiz-options').classList.add('hidden');
        const resultText = document.getElementById('quiz-result-text');
        resultText.textContent = isCorrect ? '回答正确！攻击力 +5' : '回答错误！血量 -10';
        resultText.style.color = isCorrect ? '#4ecca3' : '#e74c3c';
        document.getElementById('quiz-explanation').textContent = q.explanation;

        if (!isCorrect && selected) {
            this.recordWrongAnswer(q.id, selected);
        }

        if (this.onAnswer) this.onAnswer(isCorrect, q);
    }

    async recordWrongAnswer(questionId, wrongOption) {
        try {
            await fetch(`${API_BASE}/wrong-answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId, wrongOption,
                    playerName: window.playerName || 'player'
                })
            });
        } catch (e) { console.error('Failed to record wrong answer:', e); }
    }

    bindEvents() {
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswer(btn.dataset.option));
        });
        document.getElementById('quiz-continue').addEventListener('click', () => {
            document.getElementById('quiz-overlay').classList.add('hidden');
            if (this.onContinue) this.onContinue();
        });
    }
}
