/**
 * SCREEN: DRAG DROP
 * Logic cho câu hỏi dạng kéo thả phân loại
 */

const DragDropHandler = {
    /**
     * Render câu hỏi Drag Drop
     */
    render: function(q) {
        return `
            <div class="drag-drop-container">
                <div class="drag-source">
                    <div class="drag-source-title">Kéo các hình vào cột phù hợp:</div>
                    <div class="draggable-items">
                        ${q.drag_items.map((item, i) => `
                            <div class="draggable-item" draggable="true" data-id="${item.id}">
                                <img src="${item.image}" class="draggable-item-img">
                                <div class="draggable-item-label">${item.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="drop-zones">
                    <div class="drop-zone safe" data-zone="safe">
                        <div class="drop-zone-header">✓ An Toàn</div>
                        <div class="drop-zone-items"></div>
                    </div>
                    <div class="drop-zone danger" data-zone="danger">
                        <div class="drop-zone-header">⚠ Nguy Cơ</div>
                        <div class="drop-zone-items"></div>
                    </div>
                </div>
                <button class="submit-button" id="submit-drag-drop">Xác nhận</button>
            </div>
        `;
    },

    /**
     * Attach event listeners cho Drag Drop
     */
    attach: function(q) {
        const draggables = this.container.querySelectorAll('.draggable-item');
        const zones = this.container.querySelectorAll('.drop-zone');
        const btn = this.container.querySelector('#submit-drag-drop');
        const placements = {};
        
        // Setup draggable items
        draggables.forEach(item => {
            item.ondragstart = (e) => {
                if (item.classList.contains('placed')) return;
                item.classList.add('dragging');
                e.dataTransfer.setData('id', item.dataset.id);
            };
            
            item.ondragend = () => {
                item.classList.remove('dragging');
            };
        });
        
        // Setup drop zones
        zones.forEach(zone => {
            zone.ondragover = (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            };
            
            zone.ondragleave = () => {
                zone.classList.remove('drag-over');
            };
            
            zone.ondrop = (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const id = e.dataTransfer.getData('id');
                const item = this.container.querySelector(`.draggable-item[data-id="${id}"]`);
                
                if (!item || item.classList.contains('placed')) return;
                
                const zoneType = zone.dataset.zone;
                const zoneItems = zone.querySelector('.drop-zone-items');
                
                // Tạo clone
                const clone = item.cloneNode(true);
                clone.classList.add('dropped-item');
                clone.removeAttribute('draggable');
                
                // Thêm nút remove
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-item';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => {
                    clone.remove();
                    item.classList.remove('placed');
                    delete placements[id];
                    btn.disabled = Object.keys(placements).length !== q.drag_items.length;
                };
                
                clone.appendChild(removeBtn);
                zoneItems.appendChild(clone);
                
                // Đánh dấu đã đặt
                item.classList.add('placed');
                placements[id] = zoneType;
                
                // Enable nút submit khi đã đặt hết
                btn.disabled = Object.keys(placements).length !== q.drag_items.length;
            };
        });
        
        // Submit
        btn.onclick = () => {
            let correctCount = 0;
            
            q.drag_items.forEach(item => {
                if (placements[item.id] === item.correct_zone) {
                    correctCount++;
                }
            });
            
            const isCorrect = correctCount === q.drag_items.length;
            
            btn.disabled = true;
            draggables.forEach(item => item.draggable = false);
            
            this.feedback(isCorrect, q.pmax, q, `Xếp đúng ${correctCount}/${q.drag_items.length}`);
        };
    }
};
