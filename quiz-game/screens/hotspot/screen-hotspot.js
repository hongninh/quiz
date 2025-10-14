/**
 * SCREEN: HOTSPOT (Single & Multi)
 * Logic cho câu hỏi dạng click vào điểm trên hình ảnh
 */

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
