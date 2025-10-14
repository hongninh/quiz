/**
 * SCREEN: MCQ & MULTI - Text-based questions
 * Logic cho câu hỏi dạng chọn 1 hoặc nhiều đáp án (text)
 */

const MCQHandler = {
    /**
     * Render câu hỏi MCQ (single choice)
     */
    render: function(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="text-answers-container">
                ${q.opt_array.map((answer, i) => `
                    <div class="text-answer-option" data-index="${i}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="answer-text">${answer}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Attach event listeners cho MCQ
     */
    attach: function(q) {
        const options = this.container.querySelectorAll('.text-answer-option');
        
        options.forEach((opt, i) => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                
                const isCorrect = q.opt_array[i] === q.sol_array;
                
                // Disable tất cả options
                options.forEach(o => o.classList.add('disabled'));
                
                // Đánh dấu đáp án được chọn
                opt.classList.add(isCorrect ? 'correct' : 'incorrect');
                
                // Hiển thị đáp án đúng nếu chọn sai
                if (!isCorrect) {
                    const correctIndex = q.opt_array.indexOf(q.sol_array);
                    options[correctIndex].classList.add('correct');
                }
                
                // Hiển thị feedback
                this.feedback(isCorrect, q.pmax, q);
            };
        });
    }
};

const MultiHandler = {
    /**
     * Render câu hỏi Multi (multiple choice)
     */
    render: function(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="text-answers-container">
                ${q.opt_array.map((answer, i) => `
                    <div class="text-answer-option" data-index="${i}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="answer-text">${answer}</span>
                        <span class="answer-checkbox">☐</span>
                    </div>
                `).join('')}
            </div>
            <button class="submit-button" id="submit-multi">Xác nhận</button>
        `;
    },

    /**
     * Attach event listeners cho Multi
     */
    attach: function(q) {
        const options = this.container.querySelectorAll('.text-answer-option');
        const btn = this.container.querySelector('#submit-multi');
        const selected = new Set();
        
        options.forEach((opt, i) => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                
                const answer = q.opt_array[i];
                
                if (selected.has(answer)) {
                    selected.delete(answer);
                    opt.classList.remove('selected');
                    opt.querySelector('.answer-checkbox').textContent = '☐';
                } else {
                    selected.add(answer);
                    opt.classList.add('selected');
                    opt.querySelector('.answer-checkbox').textContent = '☑';
                }
                
                btn.disabled = selected.size === 0;
            };
        });
        
        btn.onclick = () => {
            const correctSet = new Set(q.sol_array);
            const isCorrect = selected.size === correctSet.size && 
                            [...selected].every(item => correctSet.has(item));
            
            // Đánh dấu các đáp án
            options.forEach((opt, i) => {
                opt.classList.add('disabled');
                const answer = q.opt_array[i];
                
                if (correctSet.has(answer)) {
                    opt.classList.add('correct');
                } else if (selected.has(answer)) {
                    opt.classList.add('incorrect');
                }
            });
            
            btn.disabled = true;
            this.feedback(isCorrect, q.pmax, q);
        };
    }
};
