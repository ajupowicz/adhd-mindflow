document.addEventListener('DOMContentLoaded', () => {
    const items = [
      { id: 1, wordA: "apple", wordB: "jabłko" },
      { id: 2, wordA: "dog", wordB: "pies" },
      { id: 3, wordA: "car", wordB: "samochód" },
      { id: 4, wordA: "sun", wordB: "słońce" }
    ];
  
    let selected = [], matched = [], score = 0, timeLeft = 60, timer;
    const board = document.getElementById('game-board');
    const timerEl = document.getElementById('timer');
    const scoreEl = document.getElementById('score');
    const gameOverEl = document.getElementById('game-over');
    const finalScoreEl = document.getElementById('final-score');
  
    startGame();
  
    function startGame() {
      board.innerHTML = '';
      selected = [];
      matched = [];
      score = 0;
      timeLeft = 60;
      scoreEl.textContent = 'Score: 0';
      timerEl.textContent = timeLeft;
      gameOverEl.style.display = 'none';
  
      const cards = [];
      items.forEach(i => {
        cards.push({ type: 'A', value: i.wordA, id: i.id });
        cards.push({ type: 'B', value: i.wordB, id: i.id });
      });
      cards.sort(() => 0.5 - Math.random());
  
      cards.forEach(c => {
        const el = document.createElement('div');
        el.className = 'card';
        el.textContent = 'Click';
        el.dataset.id = c.id;
        el.dataset.type = c.type;
        el.dataset.value = c.value;
        board.appendChild(el);
      });
  
      board.onclick = handleClick;
      startTimer();
    }
  
    function handleClick(e) {
      const el = e.target.closest('.card');
      if (!el || el.classList.contains('matched') || selected.includes(el)) return;
  
      el.textContent = el.dataset.value;
      selected.push(el);
  
      if (selected.length === 2) {
        const [a, b] = selected;
        if (a.dataset.id === b.dataset.id && a.dataset.type !== b.dataset.type) {
          a.classList.add('matched');
          b.classList.add('matched');
          matched.push(a.dataset.id);
          score++;
          scoreEl.textContent = 'Score: ' + score;
          if (matched.length === items.length) endGame();
        } else {
          setTimeout(() => {
            a.textContent = 'Click';
            b.textContent = 'Click';
          }, 800);
        }
        selected = [];
      }
    }
  
    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer);
          endGame();
        }
      }, 1000);
    }
  
    function endGame() {
      board.innerHTML = '';
      gameOverEl.style.display = 'block';
      finalScoreEl.textContent = score;
    }
  });
  