/**
 * SCREEN: ORDER
 * Logic cho câu hỏi dạng sắp xếp thứ tự
 */

const OrderHandler = {
    /**
     * Render câu hỏi Order
     */
    render: function(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="order-container">
                <div class="order-items" id="order-items">
                    ${q.opt_array.map((item, i) => `
                        <div class="order-item" draggable="true" data-text="${item}">
                            <span class="order-number">${i + 1}</span>
                            <span class="order-text">${item}</span>
                            <span class="drag-handle">☰</span>
                        </div>
                    `).join('')}
                </div>
                <button class="submit-button" id="submit-order">Xác nhận</button>
            </div>
        `;
    },

    /**
     * Attach event listeners cho Order
     */
    attach: function(q) {
        const items = this.container.querySelectorAll('.order-item');
        const btn = this.container.querySelector('#submit-order');
        let draggedItem = null;
        
        items.forEach(item => {
            item.ondragstart = () => {
                draggedItem = item;
                item.classList.add('dragging');
            };
            
            item.ondragend = () => {
                item.classList.remove('dragging');
            };
            
            item.ondragover = (e) => {
                e.preventDefault();
                const container = this.container.querySelector('#order-items');
                const afterElement = this.getDragAfterElement(container, e.clientY);
                
                if (!afterElement) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
                
                this.updateOrderNumbers();
            };
        });
        
        btn.onclick = () => {
            const currentOrder = Array.from(items).map(item => item.dataset.text);
            const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(q.sol_array);
            
            items.forEach(item => {
                item.classList.add('disabled');
                item.draggable = false;
            });
            
            btn.disabled = true;
            this.feedback(isCorrect, q.pmax, q);
        };
    },

    /**
     * Helper: Tìm element sau vị trí kéo
     */
    getDragAfterElement: function(container, y) {
        const draggableElements = [...container.querySelectorAll('.order-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    /**
     * Helper: Cập nhật số thứ tự
     */
    updateOrderNumbers: function() {
        this.container.querySelectorAll('.order-item').forEach((item, index) => {
            item.querySelector('.order-number').textContent = index + 1;
        });
    }
};
