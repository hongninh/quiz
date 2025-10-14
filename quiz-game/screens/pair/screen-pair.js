/**
 * SCREEN: IMAGE PAIR
 * Logic cho câu hỏi dạng ghép cặp hình ảnh
 */

const ImagePairHandler = {
    /**
     * Render câu hỏi Image Pair
     */
    render: function(q) {
        const safe = q.image_json.slice(0, 3);
        const danger = q.image_json.slice(3, 6);
        
        return `
            <div class="image-pair-container">
                <div class="pair-instructions">🔄 ${q.qtxt}</div>
                <div class="pair-columns">
                    <div class="pair-column safe">
                        <div class="pair-column-header">✓ An Toàn</div>
                        ${safe.map((img, i) => `
                            <div class="pair-item" data-group="safe" data-index="${i}">
                                <img src="${img}" class="pair-item-img">
                                <div class="pair-item-label">${i + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pair-column danger">
                        <div class="pair-column-header">⚠ Nguy Hiểm</div>
                        ${danger.map((img, i) => `
                            <div class="pair-item" data-group="danger" data-index="${i}">
                                <img src="${img}" class="pair-item-img">
                                <div class="pair-item-label">${i + 4}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="submit-button" id="submit-pair" disabled>Xác nhận</button>
            </div>
        `;
    },

    /**
     * Attach event listeners cho Image Pair
     */
    attach: function(q) {
        const items = this.container.querySelectorAll('.pair-item');
        const btn = this.container.querySelector('#submit-pair');
        let firstSelected = null;
        const pairs = [];
        
        items.forEach(item => {
            item.onclick = () => {
                if (item.classList.contains('matched') || 
                    item.classList.contains('disabled')) return;
                
                if (!firstSelected) {
                    // Chọn item đầu tiên
                    firstSelected = item;
                    item.classList.add('selected');
                } else {
                    // Chọn item thứ hai
                    if (firstSelected === item) {
                        // Click vào chính nó -> bỏ chọn
                        firstSelected.classList.remove('selected');
                        firstSelected = null;
                        return;
                    }
                    
                    // Kiểm tra có phải 2 cột khác nhau không
                    if (firstSelected.dataset.group !== item.dataset.group) {
                        // Lưu cặp
                        const safeIndex = firstSelected.dataset.group === 'safe' 
                            ? parseInt(firstSelected.dataset.index) 
                            : parseInt(item.dataset.index);
                        const dangerIndex = firstSelected.dataset.group === 'danger' 
                            ? parseInt(firstSelected.dataset.index) 
                            : parseInt(item.dataset.index);
                        
                        pairs.push([safeIndex, dangerIndex]);
                        
                        // Đánh dấu đã ghép
                        firstSelected.classList.add('matched');
                        firstSelected.classList.remove('selected');
                        item.classList.add('matched');
                        firstSelected = null;
                        
                        // Enable nút submit khi ghép đủ 3 cặp
                        btn.disabled = pairs.length !== 3;
                    } else {
                        // Cùng cột -> chuyển sang chọn item mới
                        firstSelected.classList.remove('selected');
                        firstSelected = item;
                        item.classList.add('selected');
                    }
                }
            };
        });
        
        btn.onclick = () => {
            // Kiểm tra kết quả
            let correctCount = 0;
            pairs.forEach(pair => {
                if (pair[0] === pair[1]) correctCount++;
            });
            
            const isCorrect = correctCount === 3;
            
            items.forEach(item => item.classList.add('disabled'));
            btn.disabled = true;
            
            this.feedback(isCorrect, q.pmax, q, `Ghép đúng ${correctCount}/3`);
        };
    }
};
