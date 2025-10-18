/**
 * GLOBAL QUIZ ENGINE WITH ID SYSTEM
 * Core JavaScript engine cho tất cả các quiz trên procfu.com
 * Phiên bản này sử dụng ID thay vì index
 * Nhúng file này trước local-quiz-*.js
 */

class QuizEngine {
    constructor(gameData) {
        this.gameData = gameData;
        this.questions = gameData.EachQuiz || [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalPoints = 0;
        this.maxPoints = gameData.main_total_max_points || 0;
        this.answers = [];
        this.quizResults = [];
        this.container = null;
        this.currentAnswer = null;
        this.currentQuestionStartTime = null;
        this.quizStartTime = null;
        this.streak = 0;
        this.cumulativeScore = 0;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        this.quizStartTime = new Date();
        this.render();
    }

    render() {
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.renderResults();
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        const total = this.questions.length;
        const num = this.currentQuestionIndex + 1;
        this.currentQuestionStartTime = new Date();

        let qHtml = '';
        switch (q.qtype) {
            case 'mcq': qHtml = this.renderMCQ(q); break;
            case 'multi': qHtml = this.renderMulti(q); break;
            case 'image_mcq': qHtml = this.renderImageMCQ(q); break;
            case 'image_multi': qHtml = this.renderImageMulti(q); break;
            case 'hotspot': qHtml = this.renderHotspot(q); break;
            case 'multi_hotspot': qHtml = this.renderMultiHotspot(q); break;
            case 'order': qHtml = this.renderOrder(q); break;
            case 'image_pair': qHtml = this.renderImagePair(q); break;
            case 'drag_drop': qHtml = this.renderDragDrop(q); break;
        }

        this.container.innerHTML = `
            <div class="quiz-container">
                ${num === 1 ? `<div class="quiz-header">
                    <h1 class="quiz-main-title">${this.gameData.main_title}</h1>
                    <p class="quiz-description">${this.gameData.main_description}</p>
                </div>` : ''}
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(num / total) * 100}%"></div>
                    </div>
                    <div class="progress-text">Câu ${num} / ${total} • ${q.pmax} điểm</div>
                </div>
                <div class="question-container">
                    <span class="question-type-badge">${this.getTypeLabel(q.qtype)}</span>
                    <h2 class="question-title">${q.qtxt}</h2>
                    ${qHtml}
                </div>
            </div>
        `;
        this.attachEventListeners(q);
    }

    getTypeLabel(t) {
        const l = {
            'mcq': 'Chọn 1 đáp án',
            'multi': 'Chọn nhiều đáp án',
            'image_mcq': 'Chọn 1 hình',
            'image_multi': 'Chọn nhiều hình',
            'hotspot': 'Click điểm',
            'multi_hotspot': 'Click nhiều điểm',
            'order': 'Sắp xếp',
            'image_pair': 'Ghép cặp',
            'drag_drop': 'Kéo thả'
        };
        return l[t] || t;
    }

    // ===== TEXT MCQ (với text_id) =====
    renderMCQ(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="text-answers-container">
                ${q.opt_array.map((opt, i) => `
                    <div class="text-answer-option" data-id="${opt.text_id}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="answer-text">${opt.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== TEXT MULTI (với text_id) =====
    renderMulti(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="text-answers-container">
                ${q.opt_array.map((opt, i) => `
                    <div class="text-answer-option" data-id="${opt.text_id}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="answer-text">${opt.text}</span>
                        <span class="answer-checkbox">☐</span>
                    </div>
                `).join('')}
            </div>
            <button class="submit-button" id="submit-multi">Xác nhận</button>
        `;
    }

    // ===== IMAGE MCQ (với image_id) =====
    renderImageMCQ(q) {
        return `
            <div class="image-answers-container">
                ${q.opt_array.map((opt, i) => `
                    <div class="image-answer-option" data-id="${opt.image_id}">
                        <img src="${opt.image}" alt="${opt.text}" class="image-answer-img">
                        <div class="image-answer-text">${opt.text}</div>
                        <div class="image-answer-checkbox">○</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== IMAGE MULTI (với image_id) =====
    renderImageMulti(q) {
        return `
            <div class="image-answers-container">
                ${q.opt_array.map((opt, i) => `
                    <div class="image-answer-option" data-id="${opt.image_id}">
                        <img src="${opt.image}" alt="${opt.text}" class="image-answer-img">
                        <div class="image-answer-text">${opt.text}</div>
                        <div class="image-answer-checkbox">☐</div>
                    </div>
                `).join('')}
            </div>
            <button class="submit-button" id="submit-image-multi">Xác nhận</button>
        `;
    }

    // ===== HOTSPOT (với x_y_id) =====
    renderHotspot(q) {
        return `
            <div class="hotspot-container">
                <div class="hotspot-instructions">📍 ${q.qtxt}</div>
                <div class="hotspot-image-wrapper">
                    <img src="${q.image_json[0]}" class="hotspot-image" id="hotspot-img">
                    <div class="hotspot-overlay" id="hotspot-overlay"></div>
                </div>
            </div>
        `;
    }

    // ===== MULTI HOTSPOT (với x_y_id) =====
    renderMultiHotspot(q) {
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
                            <div class="hotspot-point" data-id="${h.x_y_id}" style="left: ${h.x}%; top: ${h.y}%;">${i + 1}</div>
                        `).join('')}
                    </div>
                </div>
                <button class="submit-button" id="submit-multi-hotspot">Xác nhận</button>
            </div>
        `;
    }

    // ===== ORDER (với text_id) =====
    renderOrder(q) {
        return `
            ${q.image_json?.[0] ? `<img src="${q.image_json[0]}" class="question-image">` : ''}
            <div class="order-container">
                <div class="order-items" id="order-items">
                    ${q.opt_array.map((opt, i) => `
                        <div class="order-item" draggable="true" data-id="${opt.text_id}">
                            <span class="order-number">${i + 1}</span>
                            <span class="order-text">${opt.text}</span>
                            <span class="drag-handle">☰</span>
                        </div>
                    `).join('')}
                </div>
                <button class="submit-button" id="submit-order">Xác nhận</button>
            </div>
        `;
    }

    // ===== IMAGE PAIR (với image_id) =====
    renderImagePair(q) {
        const halfLen = Math.floor(q.image_json.length / 2);
        const col1 = q.image_json.slice(0, halfLen);
        const col2 = q.image_json.slice(halfLen);
        
        return `
            <div class="image-pair-container">
                <div class="pair-instructions">🔄 ${q.qtxt}</div>
                <div class="pair-columns">
                    <div class="pair-column safe">
                        <div class="pair-column-header">✓ Cột 1</div>
                        ${col1.map((img, i) => `
                            <div class="pair-item" data-group="col1" data-id="${img.image_id}">
                                <img src="${img.image}" class="pair-item-img">
                                <div class="pair-item-label">${i + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pair-column danger">
                        <div class="pair-column-header">⚠️ Cột 2</div>
                        ${col2.map((img, i) => `
                            <div class="pair-item" data-group="col2" data-id="${img.image_id}">
                                <img src="${img.image}" class="pair-item-img">
                                <div class="pair-item-label">${i + halfLen + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="submit-button" id="submit-pair" disabled>Xác nhận</button>
            </div>
        `;
    }

    // ===== DRAG & DROP (với image_id) =====
    renderDragDrop(q) {
        return `
            <div class="drag-drop-container">
                <div class="drag-source">
                    <div class="drag-source-title">Kéo các hình vào cột phù hợp:</div>
                    <div class="draggable-items">
                        ${q.drag_items.map((item, i) => `
                            <div class="draggable-item" draggable="true" data-id="${item.image_id}">
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
                        <div class="drop-zone-header">⚠️ Nguy Cơ</div>
                        <div class="drop-zone-items"></div>
                    </div>
                </div>
                <button class="submit-button" id="submit-drag-drop">Xác nhận</button>
            </div>
        `;
    }

    attachEventListeners(q) {
        switch (q.qtype) {
            case 'mcq': this.onMCQ(q); break;
            case 'multi': this.onMulti(q); break;
            case 'image_mcq': this.onImageMCQ(q); break;
            case 'image_multi': this.onImageMulti(q); break;
            case 'hotspot': this.onHotspot(q); break;
            case 'multi_hotspot': this.onMultiHotspot(q); break;
            case 'order': this.onOrder(q); break;
            case 'image_pair': this.onImagePair(q); break;
            case 'drag_drop': this.onDragDrop(q); break;
        }
    }

    // ===== EVENT: MCQ (so sánh text_id) =====
    onMCQ(q) {
        const opts = this.container.querySelectorAll('.text-answer-option');
        opts.forEach(opt => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                const selectedId = opt.dataset.id;
                const ok = selectedId === q.sol_array;
                
                opts.forEach(o => o.classList.add('disabled'));
                opt.classList.add(ok ? 'correct' : 'incorrect');
                
                if (!ok) {
                    const correctOpt = this.container.querySelector(`.text-answer-option[data-id="${q.sol_array}"]`);
                    if (correctOpt) correctOpt.classList.add('correct');
                }
                
                this.recordAnswer(q, selectedId, ok);
                this.feedback(ok, q.pmax, q);
            };
        });
    }

    // ===== EVENT: MULTI (so sánh text_id) =====
    onMulti(q) {
        const opts = this.container.querySelectorAll('.text-answer-option');
        const btn = this.container.querySelector('#submit-multi');
        const sel = new Set();
        
        opts.forEach(opt => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                const id = opt.dataset.id;
                
                if (sel.has(id)) {
                    sel.delete(id);
                    opt.classList.remove('selected');
                    opt.querySelector('.answer-checkbox').textContent = '☐';
                } else {
                    sel.add(id);
                    opt.classList.add('selected');
                    opt.querySelector('.answer-checkbox').textContent = '☑️';
                }
                btn.disabled = sel.size === 0;
            };
        });
        
        btn.onclick = () => {
            const correctIds = new Set(q.sol_array);
            const ok = sel.size === correctIds.size && [...sel].every(id => correctIds.has(id));
            
            opts.forEach(opt => {
                opt.classList.add('disabled');
                const id = opt.dataset.id;
                if (correctIds.has(id)) {
                    opt.classList.add('correct');
                } else if (sel.has(id)) {
                    opt.classList.add('incorrect');
                }
            });
            
            btn.disabled = true;
            this.recordAnswer(q, [...sel], ok);
            this.feedback(ok, q.pmax, q);
        };
    }

    // ===== EVENT: IMAGE MCQ (so sánh image_id) =====
    onImageMCQ(q) {
        const opts = this.container.querySelectorAll('.image-answer-option');
        opts.forEach(opt => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                const selectedId = opt.dataset.id;
                const ok = selectedId === q.sol_array;
                
                opts.forEach(o => o.classList.add('disabled'));
                opt.classList.add(ok ? 'correct' : 'incorrect');
                opt.querySelector('.image-answer-checkbox').textContent = ok ? '✓' : '✗';
                
                if (!ok) {
                    const correctOpt = this.container.querySelector(`.image-answer-option[data-id="${q.sol_array}"]`);
                    if (correctOpt) {
                        correctOpt.classList.add('correct');
                        correctOpt.querySelector('.image-answer-checkbox').textContent = '✓';
                    }
                }
                
                this.recordAnswer(q, selectedId, ok);
                this.feedback(ok, q.pmax, q);
            };
        });
    }

    // ===== EVENT: IMAGE MULTI (so sánh image_id) =====
    onImageMulti(q) {
        const opts = this.container.querySelectorAll('.image-answer-option');
        const btn = this.container.querySelector('#submit-image-multi');
        const sel = new Set();
        
        opts.forEach(opt => {
            opt.onclick = () => {
                if (opt.classList.contains('disabled')) return;
                const id = opt.dataset.id;
                
                if (sel.has(id)) {
                    sel.delete(id);
                    opt.classList.remove('selected');
                    opt.querySelector('.image-answer-checkbox').textContent = '☐';
                } else {
                    sel.add(id);
                    opt.classList.add('selected');
                    opt.querySelector('.image-answer-checkbox').textContent = '☑️';
                }
                btn.disabled = sel.size === 0;
            };
        });
        
        btn.onclick = () => {
            const correctIds = new Set(q.sol_array);
            const ok = sel.size === correctIds.size && [...sel].every(id => correctIds.has(id));
            
            opts.forEach(opt => {
                opt.classList.add('disabled');
                const id = opt.dataset.id;
                const ck = opt.querySelector('.image-answer-checkbox');
                
                if (correctIds.has(id)) {
                    opt.classList.add('correct');
                    ck.textContent = '✓';
                } else if (sel.has(id)) {
                    opt.classList.add('incorrect');
                    ck.textContent = '✗';
                }
            });
            
            btn.disabled = true;
            this.recordAnswer(q, [...sel], ok);
            this.feedback(ok, q.pmax, q);
        };
    }

    // ===== EVENT: HOTSPOT (so sánh x_y_id) =====
    onHotspot(q) {
        const overlay = this.container.querySelector('#hotspot-overlay');
        const img = this.container.querySelector('#hotspot-img');
        let clicked = false;
        
        overlay.onclick = (e) => {
            if (clicked) return;
            
            const rect = img.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (img.naturalWidth / rect.width);
            const y = (e.clientY - rect.top) * (img.naturalHeight / rect.height);
            const dist = Math.hypot(x - q.sol_json.x, y - q.sol_json.y);
            const ok = dist <= q.sol_json.radius;

            const pt = document.createElement('div');
            pt.className = `hotspot-click-point ${ok ? 'correct' : 'incorrect'}`;
            pt.style.left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
            pt.style.top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
            pt.textContent = ok ? '✓' : '✗';
            overlay.appendChild(pt);

            if (!ok) {
                const cor = document.createElement('div');
                cor.className = 'hotspot-click-point correct';
                cor.style.left = `${(q.sol_json.x / img.naturalWidth) * 100}%`;
                cor.style.top = `${(q.sol_json.y / img.naturalHeight) * 100}%`;
                cor.textContent = '✓';
                overlay.appendChild(cor);
            }
            
            clicked = true;
            this.recordAnswer(q, { x: Math.round(x), y: Math.round(y), clicked_id: q.sol_json.x_y_id }, ok);
            this.feedback(ok, q.pmax, q);
        };
    }

    // ===== EVENT: MULTI HOTSPOT (so sánh x_y_id) =====
    onMultiHotspot(q) {
        const pts = this.container.querySelectorAll('.hotspot-point');
        const btn = this.container.querySelector('#submit-multi-hotspot');
        const sel = new Set();
        
        pts.forEach(pt => {
            pt.onclick = () => {
                if (pt.classList.contains('disabled')) return;
                const id = pt.dataset.id;
                
                if (sel.has(id)) {
                    sel.delete(id);
                    pt.classList.remove('selected');
                } else {
                    sel.add(id);
                    pt.classList.add('selected');
                }
                btn.disabled = sel.size === 0;
            };
        });
        
        btn.onclick = () => {
            const correctIds = new Set(q.sol_array);
            let correctCount = 0;
            
            pts.forEach(pt => {
                pt.classList.add('disabled');
                const id = pt.dataset.id;
                
                if (correctIds.has(id)) {
                    pt.classList.add('correct');
                    if (sel.has(id)) correctCount++;
                } else if (sel.has(id)) {
                    pt.classList.add('incorrect');
                }
            });
            
            const ok = correctCount === correctIds.size && sel.size === correctIds.size;
            btn.disabled = true;
            
            this.recordAnswer(q, [...sel], ok);
            this.feedback(ok, q.pmax, q, `Đúng ${correctCount}/${correctIds.size} điểm`);
        };
    }

    // ===== EVENT: ORDER (so sánh text_id) =====
    onOrder(q) {
        const items = this.container.querySelectorAll('.order-item');
        const btn = this.container.querySelector('#submit-order');
        let drag = null;
        
        items.forEach(item => {
            item.ondragstart = () => { 
                drag = item;
                item.classList.add('dragging');
            };
            item.ondragend = () => item.classList.remove('dragging');
            item.ondragover = (e) => {
                e.preventDefault();
                const cont = this.container.querySelector('#order-items');
                const after = this.getDragAfter(cont, e.clientY);
                if (!after) cont.appendChild(drag);
                else cont.insertBefore(drag, after);
                this.updateOrderNums();
            };
        });
        
        btn.onclick = () => {
            const currentOrder = Array.from(this.container.querySelectorAll('.order-item'))
                .map(i => i.dataset.id);
            const ok = JSON.stringify(currentOrder) === JSON.stringify(q.sol_array);
            
            this.container.querySelectorAll('.order-item').forEach(i => {
                i.classList.add('disabled');
                i.draggable = false;
            });
            
            btn.disabled = true;
            this.recordAnswer(q, currentOrder, ok);
            this.feedback(ok, q.pmax, q);
        };
    }

    updateOrderNums() {
        this.container.querySelectorAll('.order-item').forEach((i, idx) => {
            i.querySelector('.order-number').textContent = idx + 1;
        });
    }

    getDragAfter(cont, y) {
        const els = [...cont.querySelectorAll('.order-item:not(.dragging)')];
        return els.reduce((close, child) => {
            const box = child.getBoundingClientRect();
            const off = y - box.top - box.height / 2;
            if (off < 0 && off > close.offset) return { offset: off, element: child };
            return close;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // ===== EVENT: IMAGE PAIR (so sánh image_id) =====
    onImagePair(q) {
        const items = this.container.querySelectorAll('.pair-item');
        const btn = this.container.querySelector('#submit-pair');
        let first = null;
        const pairs = [];
        
        items.forEach(item => {
            item.onclick = () => {
                if (item.classList.contains('matched') || item.classList.contains('disabled')) return;
                
                if (!first) {
                    first = item;
                    item.classList.add('selected');
                } else {
                    if (first === item) {
                        first.classList.remove('selected');
                        first = null;
                        return;
                    }
                    
                    if (first.dataset.group !== item.dataset.group) {
                        const id1 = first.dataset.group === 'col1' ? first.dataset.id : item.dataset.id;
                        const id2 = first.dataset.group === 'col2' ? first.dataset.id : item.dataset.id;
                        pairs.push([id1, id2]);
                        
                        first.classList.add('matched');
                        first.classList.remove('selected');
                        item.classList.add('matched');
                        first = null;
                        
                        const expectedPairs = q.sol_array.length;
                        btn.disabled = pairs.length !== expectedPairs;
                    } else {
                        first.classList.remove('selected');
                        first = item;
                        item.classList.add('selected');
                    }
                }
            };
        });
        
        btn.onclick = () => {
            let correctCount = 0;
            const solutionMap = new Map(q.sol_array.map(p => [JSON.stringify(p.sort()), true]));
            
            pairs.forEach(p => {
                if (solutionMap.has(JSON.stringify([...p].sort()))) {
                    correctCount++;
                }
            });
            
            const ok = correctCount === q.sol_array.length;
            items.forEach(i => i.classList.add('disabled'));
            btn.disabled = true;
            
            this.recordAnswer(q, pairs, ok);
            this.feedback(ok, q.pmax, q, `Ghép đúng ${correctCount}/${q.sol_array.length}`);
        };
    }

    // ===== EVENT: DRAG DROP (so sánh image_id) =====
    onDragDrop(q) {
        const drags = this.container.querySelectorAll('.draggable-item');
        const zones = this.container.querySelectorAll('.drop-zone');
        const btn = this.container.querySelector('#submit-drag-drop');
        const placement = {};

        drags.forEach(d => {
            d.ondragstart = (e) => {
                if (d.classList.contains('placed')) return;
                d.classList.add('dragging');
                e.dataTransfer.setData('id', d.dataset.id);
            };
            d.ondragend = () => d.classList.remove('dragging');
        });

        zones.forEach(z => {
            z.ondragover = (e) => { 
                e.preventDefault();
                z.classList.add('drag-over');
            };
            z.ondragleave = () => z.classList.remove('drag-over');
            z.ondrop = (e) => {
                e.preventDefault();
                z.classList.remove('drag-over');
                const id = e.dataTransfer.getData('id');
                const d = this.container.querySelector(`.draggable-item[data-id="${id}"]`);
                if (!d || d.classList.contains('placed')) return;

                const zType = z.dataset.zone;
                const zItems = z.querySelector('.drop-zone-items');
                const clone = d.cloneNode(true);
                clone.classList.add('dropped-item');
                clone.removeAttribute('draggable');

                const rmBtn = document.createElement('button');
                rmBtn.className = 'remove-item';
                rmBtn.innerHTML = '×';
                rmBtn.onclick = () => {
                    clone.remove();
                    d.classList.remove('placed');
                    delete placement[id];
                    btn.disabled = Object.keys(placement).length !== q.drag_items.length;
                };
                
                clone.appendChild(rmBtn);
                zItems.appendChild(clone);
                d.classList.add('placed');
                placement[id] = zType;
                btn.disabled = Object.keys(placement).length !== q.drag_items.length;
            };
        });

        btn.onclick = () => {
            let correctCount = 0;
            
            q.drag_items.forEach(item => {
                if (placement[item.image_id] === item.correct_zone) {
                    correctCount++;
                }
            });
            
            const ok = correctCount === q.drag_items.length;
            btn.disabled = true;
            drags.forEach(d => d.draggable = false);
            
            this.recordAnswer(q, placement, ok);
            this.feedback(ok, q.pmax, q, `Xếp đúng ${correctCount}/${q.drag_items.length}`);
        };
    }

    // ===== RECORD ANSWER =====
    recordAnswer(q, userAnswer, isCorrect) {
        this.answers.push({
            question_id: q.qid,
            question_number: q.qn,
            question_type: q.qtype,
            user_answer: userAnswer,
            correct_answer: q.sol_array || q.sol_json,
            is_correct: isCorrect,
            points_earned: isCorrect ? q.pmax : 0,
            max_points: q.pmax
        });
    }

    // ===== FEEDBACK =====
    feedback(ok, pts, q, msg = '') {
        const endTime = new Date();
        const playTime = endTime - this.currentQuestionStartTime;
        const timeRemaining = (q.tmax || 0) - playTime;

        if (ok) {
            this.score += pts;
            this.streak++;
            const bonusPts = this.streak >= 3 ? Math.floor(pts * 0.1) : 0;
            this.cumulativeScore = this.score + bonusPts;
        } else {
            this.streak = 0;
        }

        this.totalPoints += pts;
        
        const fb = document.createElement('div');
        fb.className = `feedback-message ${ok ? 'correct' : 'incorrect'}`;
        fb.innerHTML = `
            <div class="feedback-icon">${ok ? '✓' : '✗'}</div>
            <div class="feedback-content">
                <div class="feedback-title">${ok ? 'Chính xác!' : 'Chưa đúng!'}</div>
                ${msg ? `<div class="feedback-detail">${msg}</div>` : ''}
                <div class="feedback-explanation">${q.expl || ''}</div>
                <div class="feedback-points">+${ok ? pts : 0} điểm</div>
            </div>
        `;
        this.container.querySelector('.question-container').appendChild(fb);

        this.quizResults.push({
            qn: q.qn,
            qid: q.qid,
            qtype: q.qtype,
            correct: ok,
            points: ok ? pts : 0,
            max_points: pts,
            time_spent: playTime,
            time_remaining: Math.max(0, timeRemaining)
        });

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.render();
        }, 2500);
    }

    // ===== RENDER RESULTS =====
    renderResults() {
        const totalTime = new Date() - this.quizStartTime;
        const percent = Math.round((this.score / this.totalPoints) * 100);
        const passThreshold = this.gameData.main_pass_threshold_percent || 70;
        const passed = percent >= passThreshold;

        const resultHtml = `
            <div class="quiz-container results-container">
                <div class="results-header">
                    <h1 class="results-title">${passed ? '🎉 Xuất sắc!' : '💪 Cố gắng thêm!'}</h1>
                    <div class="results-score-circle">
                        <div class="score-circle ${passed ? 'pass' : 'fail'}">
                            <span class="score-percent">${percent}%</span>
                            <span class="score-label">${this.score}/${this.totalPoints} điểm</span>
                        </div>
                    </div>
                </div>

                <div class="results-summary">
                    <div class="summary-item">
                        <span class="summary-label">Tổng câu hỏi:</span>
                        <span class="summary-value">${this.questions.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Trả lời đúng:</span>
                        <span class="summary-value correct">${this.quizResults.filter(r => r.correct).length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Trả lời sai:</span>
                        <span class="summary-value incorrect">${this.quizResults.filter(r => !r.correct).length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Thời gian:</span>
                        <span class="summary-value">${Math.floor(totalTime / 60000)}:${String(Math.floor((totalTime % 60000) / 1000)).padStart(2, '0')}</span>
                    </div>
                </div>

                <div class="results-details">
                    <h3 class="details-title">Chi tiết từng câu:</h3>
                    ${this.quizResults.map((r, i) => {
                        const ans = this.answers[i];
                        return `
                            <div class="result-item ${r.correct ? 'correct' : 'incorrect'}">
                                <div class="result-item-header">
                                    <span class="result-item-number">Câu ${r.qn}</span>
                                    <span class="result-item-type">${this.getTypeLabel(r.qtype)}</span>
                                    <span class="result-item-status">${r.correct ? '✓' : '✗'}</span>
                                </div>
                                <div class="result-item-body">
                                    <div class="result-item-points">${r.points}/${r.max_points} điểm</div>
                                    ${ans ? `
                                        <div class="result-item-answer">
                                            <strong>Bạn chọn:</strong> ${this.formatAnswer(ans.user_answer, r.qtype)}
                                        </div>
                                        ${!r.correct ? `
                                            <div class="result-item-correct">
                                                <strong>Đáp án đúng:</strong> ${this.formatAnswer(ans.correct_answer, r.qtype)}
                                            </div>
                                        ` : ''}
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="results-actions">
                    <button class="action-button primary" onclick="location.reload()">Chơi lại</button>
                    <button class="action-button secondary" onclick="QuizUtils.downloadResults()">Tải kết quả</button>
                    <button class="action-button secondary" onclick="QuizUtils.copyResults()">Copy kết quả</button>
                </div>
            </div>
        `;

        this.container.innerHTML = resultHtml;

        // Store results for utility functions
        window.currentQuizResults = {
            gameData: this.gameData,
            results: this.quizResults,
            answers: this.answers,
            score: this.score,
            totalPoints: this.totalPoints,
            percent: percent,
            totalTime: totalTime
        };
    }

    // ===== FORMAT ANSWER FOR DISPLAY =====
    formatAnswer(answer, qtype) {
        if (Array.isArray(answer)) {
            if (answer.length === 0) return '<em>Không có</em>';
            if (qtype === 'image_pair') {
                return answer.map(pair => `[${pair[0]} ↔ ${pair[1]}]`).join(', ');
            }
            return answer.join(', ');
        }
        if (typeof answer === 'object') {
            if (answer.x !== undefined && answer.y !== undefined) {
                return `x: ${answer.x}, y: ${answer.y}`;
            }
            return JSON.stringify(answer);
        }
        return String(answer);
    }
}

// ===== UTILITY FUNCTIONS =====
window.QuizUtils = {
    downloadResults() {
        const r = window.currentQuizResults;
        if (!r) return;
        
        const text = `
${r.gameData.main_title}
${'='.repeat(50)}

Điểm số: ${r.score}/${r.totalPoints} (${r.percent}%)
Thời gian: ${Math.floor(r.totalTime / 60000)}:${String(Math.floor((r.totalTime % 60000) / 1000)).padStart(2, '0')}

Chi tiết:
${r.results.map((res, i) => {
    const ans = r.answers[i];
    return `
Câu ${res.qn} (${res.qid}): ${res.correct ? '✓' Đúng' : '✗ Sai'} - ${res.points}/${res.max_points} điểm
  Bạn chọn: ${this._formatAnswerText(ans.user_answer, res.qtype)}
  ${!res.correct ? `Đáp án đúng: ${this._formatAnswerText(ans.correct_answer, res.qtype)}` : ''}
`;
}).join('\n')}
        `.trim();

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-results-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    copyResults() {
        const r = window.currentQuizResults;
        if (!r) return;
        
        const text = `${r.gameData.main_title}\nĐiểm: ${r.score}/${r.totalPoints} (${r.percent}%)`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã copy kết quả!');
        });
    },

    _formatAnswerText(answer, qtype) {
        if (Array.isArray(answer)) {
            if (answer.length === 0) return 'Không có';
            if (qtype === 'image_pair') {
                return answer.map(pair => `[${pair[0]} ↔ ${pair[1]}]`).join(', ');
            }
            return answer.join(', ');
        }
        if (typeof answer === 'object') {
            if (answer.x !== undefined && answer.y !== undefined) {
                return `x: ${answer.x}, y: ${answer.y}`;
            }
            return JSON.stringify(answer);
        }
        return String(answer);
    }
};

console.log('✅ Quiz Engine with ID system loaded');
