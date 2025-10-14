/**
 * SCREEN: IMAGE MCQ & MULTI
 * Logic cho câu hỏi dạng chọn hình ảnh
 */

const ImageMCQHandler = {
    /**
     * Render câu hỏi Image MCQ
     */
    render: function(q) {
        return `
            <div class="image-answers-container">
                ${q.opt_array.map((item, i) => `
                    <div class="image-answer-option" data-index="${i}">
                        <img src="${item.image}" alt="${item.text}" class="image-answer-img">
                        <div class="image-answer-text">${item.text}</div>
                        <div class="image-answer-checkbox">○</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Attach event listeners cho Image MCQ
     */
    attach: function(q) {
        const options = this.container.querySelectorAll('.image-answer-option');
        
        options.forEach((opt, i) => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                
                const isCorrect = i === q.sol_array;
                
                // Disable tất cả
                options.forEach(o => o.classList.add('disabled'));
                
                // Đánh dấu
                opt.classList.add(isCorrect ? 'correct' : 'incorrect');
                opt.querySelector('.image-answer-checkbox').textContent = isCorrect ? '✓' : '✗';
                
                // Hiển thị đáp án đúng nếu sai
                if (!isCorrect) {
                    options[q.sol_array].classList.add('correct');
                    options[q.sol_array].querySelector('.image-answer-checkbox').textContent = '✓';
                }
                
                this.feedback(isCorrect, q.pmax, q);
            };
        });
    }
};

const ImageMultiHandler = {
    /**
     * Render câu hỏi Image Multi
     */
    render: function(q) {
        return `
            <div class="image-answers-container">
                ${q.opt_array.map((item, i) => `
                    <div class="image-answer-option" data-index="${i}">
                        <img src="${item.image}" alt="${item.text}" class="image-answer-img">
                        <div class="image-answer-text">${item.text}</div>
                        <div class="image-answer-checkbox">☐</div>
                    </div>
                `).join('')}
            </div>
            <button class="submit-button" id="submit-image-multi">Xác nhận</button>
        `;
    },

    /**
     * Attach event listeners cho Image Multi
     */
    attach: function(q) {
        const options = this.container.querySelectorAll('.image-answer-option');
        const btn = this.container.querySelector('#submit-image-multi');
        const selected = new Set();
        
        options.forEach((opt, i) => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                
                if (selected.has(i)) {
                    selected.delete(i);
                    opt.classList.remove('selected');
                    opt.querySelector('.image-answer-checkbox').textContent = '☐';
                } else {
                    selected.add(i);
                    opt.classList.add('selected');
                    opt.querySelector('.image-answer-checkbox').textContent = '☑';
                }
                
                btn.disabled = selected.size === 0;
            };
        });
        
        btn.onclick = () => {
            const correctSet = new Set(q.sol_array);
            const isCorrect = selected.size === correctSet.size && 
                            [...selected].every(i => correctSet.has(i));
            
            options.forEach((opt, i) => {
                opt.classList.add('disabled');
                const checkbox = opt.querySelector('.image-answer-checkbox');
                
                if (correctSet.has(i)) {
                    opt.classList.add('correct');
                    checkbox.textContent = '✓';
                } else if (selected.has(i)) {
                    opt.classList.add('incorrect');
                    checkbox.textContent = '✗';
                }
            });
            
            btn.disabled = true;
            this.feedback(isCorrect, q.pmax, q);
        };
    }
};
