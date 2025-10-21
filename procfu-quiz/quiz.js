(function(){
  // Config: minimal 2-question quiz
  const quizConfig = {
    title: 'Mini Quiz (2 câu)',
    questions: [
      {
        id: 'q1',
        text: 'Câu 1: 2 + 2 = ?',
        options: [
          { id: 'a', label: '3' },
          { id: 'b', label: '4' },
          { id: 'c', label: '5' }
        ],
        correctId: 'b'
      },
      {
        id: 'q2',
        text: 'Câu 2: Thủ đô của Việt Nam là?',
        options: [
          { id: 'a', label: 'Hà Nội' },
          { id: 'b', label: 'TP. Hồ Chí Minh' },
          { id: 'c', label: 'Đà Nẵng' }
        ],
        correctId: 'a'
      }
    ]
  };

  function select(container, selector){
    return container.querySelector(selector);
  }

  function selectAll(container, selector){
    return Array.from(container.querySelectorAll(selector));
  }

  function render(container){
    const root = document.createElement('div');
    root.className = 'pfqz-container';
    root.innerHTML = `
      <h3 class="pfqz-title">${quizConfig.title}</h3>
      <div class="pfqz-questions"></div>
      <div class="pfqz-actions">
        <button class="pfqz-btn secondary" data-action="reset" type="button">Làm lại</button>
        <button class="pfqz-btn" data-action="submit" type="button">Nộp bài</button>
      </div>
      <div class="pfqz-score" aria-live="polite"></div>
    `;

    const questionsWrap = select(root, '.pfqz-questions');

    quizConfig.questions.forEach((q, idx) => {
      const qEl = document.createElement('section');
      qEl.className = 'pfqz-q';
      qEl.setAttribute('data-qid', q.id);

      const opts = q.options.map(opt => `
        <label class="pfqz-opt">
          <input type="radio" name="${q.id}" value="${opt.id}" />
          <span>${opt.label}</span>
        </label>
      `).join('');

      qEl.innerHTML = `
        <h4>Câu ${idx+1}: ${q.text}</h4>
        <div class="pfqz-opts">${opts}</div>
      `;
      questionsWrap.appendChild(qEl);
    });

    container.innerHTML = '';
    container.appendChild(root);

    const btnSubmit = select(root, '[data-action="submit"]');
    const btnReset = select(root, '[data-action="reset"]');
    const scoreEl = select(root, '.pfqz-score');

    function evaluate(){
      let correct = 0;
      quizConfig.questions.forEach(q => {
        const qEl = select(root, `[data-qid="${q.id}"]`);
        const chosen = select(qEl, `input[name="${q.id}"]:checked`);
        const isCorrect = chosen && chosen.value === q.correctId;
        if (isCorrect) correct += 1;

        // visual feedback
        const optEls = selectAll(qEl, '.pfqz-opt');
        optEls.forEach(labelEl => labelEl.classList.remove('pfqz-correct','pfqz-wrong'));
        if (chosen){
          const chosenLabel = chosen.closest('.pfqz-opt');
          chosenLabel.classList.add(isCorrect ? 'pfqz-correct' : 'pfqz-wrong');
        }
      });
      scoreEl.textContent = `Điểm: ${correct} / ${quizConfig.questions.length}`;
    }

    function reset(){
      selectAll(root, 'input[type="radio"]').forEach(r => { r.checked = false; });
      selectAll(root, '.pfqz-opt').forEach(el => el.classList.remove('pfqz-correct','pfqz-wrong'));
      scoreEl.textContent = '';
    }

    btnSubmit.addEventListener('click', evaluate);
    btnReset.addEventListener('click', reset);
  }

  function autoMount(){
    const targets = document.querySelectorAll('[data-procfu-quiz]');
    targets.forEach(target => render(target));
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }
})();
