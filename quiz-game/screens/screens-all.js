/**
 * QUIZ GAME - ALL SCREENS JAVASCRIPT
 * Gộp tất cả handlers của các loại câu hỏi vào 1 file
 * Bao gồm: MCQ, Multi, Image MCQ, Image Multi, Hotspot, Multi Hotspot, Order, Image Pair, Drag Drop
 */

/* ==================== MCQ & MULTI (Text-based) ==================== */

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

/* ==================== IMAGE MCQ & MULTI ==================== */

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

/* ==================== HOTSPOT (Single & Multi) ==================== */

const HotspotHandler = {
    /**
     * Render câu hỏi Hotspot (single click)
     */
    render: function(q) {
        return `
            <div class="hotspot-container">
                <div class="hotspot-instructions">📍 ${q.qtxt}</div>
                <div class="hotspot-image-wrapper">
                    <img src="${q.image_json[0]}" class="hotspot-image" id="hotspot-img">
                    <div class="hotspot-overlay" id="hotspot-overlay"></div>
                </div>
            </div>
        `;
    },

    /**
     * Attach event listeners cho Hotspot
     */
    attach: function(q) {
        const overlay = this.container.querySelector('#hotspot-overlay');
        const img = this.container.querySelector('#hotspot-img');
        let clicked = false;
        
        overlay.onclick = (e) => {
            if (clicked) return;
            
            const rect = img.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (img.naturalWidth / rect.width);
            const y = (e.clientY - rect.top) * (img.naturalHeight / rect.height);
            
            // Tính khoảng cách đến điểm đúng
            const dist = Math.sqrt(
                Math.pow(x - q.sol_json.x, 2) + 
                Math.pow(y - q.sol_json.y, 2)
            );
            const isCorrect = dist <= q.sol_json.radius;
            
            // Hiển thị điểm đã click
            const point = document.createElement('div');
            point.className = `hotspot-click-point ${isCorrect ? 'correct' : 'incorrect'}`;
            point.style.left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
            point.style.top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
            point.textContent = isCorrect ? '✓' : '✗';
            overlay.appendChild(point);
            
            // Hiển thị điểm đúng nếu sai
            if (!isCorrect) {
                const correctPoint = document.createElement('div');
                correctPoint.className = 'hotspot-click-point correct';
                correctPoint.style.left = `${(q.sol_json.x / img.naturalWidth) * 100}%`;
                correctPoint.style.top = `${(q.sol_json.y / img.naturalHeight) * 100}%`;
                correctPoint.textContent = '✓';
                overlay.appendChild(correctPoint);
            }
            
            clicked = true;
            this.feedback(isCorrect, q.pmax, q);
        };
    }
};

const MultiHotspotHandler = {
    /**
     * Render câu hỏi Multi Hotspot
     */
    render: function(q) {
        const count = q.sol_array ? q.sol_array.length : 0;
        return `
            <div class="hotspot-container">
                <div class="hotspot-instructions">
                    📍 Click vào tất cả các điểm nguy hiểm (${count} điểm)
                </div>
                <div class="hotspot-image-wrapper">
                    <img src="${q.image_json[0]}" class="hotspot-image">
                    <div class="hotspot-overlay">
                        ${q.hotspot_array.map((h, i) => `
                            <div class="hotspot-point" data-id="${h.id}" 
                                 style="left: ${h.x}%; top: ${h.y}%;">${i+1}</div>
                        `).join('')}
                    </div>
                </div>
                <button class="submit-button" id="submit-multi-hotspot">Xác nhận</button>
            </div>
        `;
    },

    /**
     * Attach event listeners cho Multi Hotspot
     */
    attach: function(q) {
        const points = this.container.querySelectorAll('.hotspot-point');
        const btn = this.container.querySelector('#submit-multi-hotspot');
        const selected = new Set();
        
        points.forEach(point => {
            point.onclick = () => {
                if (point.classList.contains('disabled')) return;
                
                const id = point.dataset.id;
                
                if (selected.has(id)) {
                    selected.delete(id);
                    point.classList.remove('selected');
                } else {
                    selected.add(id);
                    point.classList.add('selected');
                }
            };
        });
        
        btn.onclick = () => {
            const correctSet = new Set(q.sol_array);
            let correctCount = 0;
            
            points.forEach(point => {
                point.classList.add('disabled');
                const id = point.dataset.id;
                
                if (correctSet.has(id)) {
                    point.classList.add('correct');
                    if (selected.has(id)) correctCount++;
                } else if (selected.has(id)) {
                    point.classList.add('incorrect');
                }
            });
            
            const isCorrect = correctCount === correctSet.size && 
                            selected.size === correctSet.size;
            
            btn.disabled = true;
            this.feedback(isCorrect, q.pmax, q, `Đúng ${correctCount}/${correctSet.size} điểm`);
        };
    }
};

/* ==================== ORDER ==================== */

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

/* ==================== IMAGE PAIR ==================== */

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

/* ==================== DRAG DROP ==================== */

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
