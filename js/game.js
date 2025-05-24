document.addEventListener('DOMContentLoaded', () => {
  // ─── master list of 20 emoji↔word pairs ───────────────────
  const allPairs = [
    { id:  1, wordA: "apple",     wordB: "🍎" },
    { id:  2, wordA: "dog",       wordB: "🐶" },
    { id:  3, wordA: "car",       wordB: "🚗" },
    { id:  4, wordA: "sun",       wordB: "☀️" },
    { id:  5, wordA: "heart",     wordB: "❤️" },
    { id:  6, wordA: "star",      wordB: "⭐" },
    { id:  7, wordA: "moon",      wordB: "🌙" },
    { id:  8, wordA: "banana",    wordB: "🍌" },
    { id:  9, wordA: "cat",       wordB: "🐱" },
    { id: 10, wordA: "flower",    wordB: "🌸" },
    { id: 11, wordA: "soccer",    wordB: "⚽" },
    { id: 12, wordA: "pizza",     wordB: "🍕" },
    { id: 13, wordA: "tree",      wordB: "🌳" },
    { id: 14, wordA: "fish",      wordB: "🐟" },
    { id: 15, wordA: "frog",      wordB: "🐸" },
    { id: 16, wordA: "book",      wordB: "📚" },
    { id: 17, wordA: "music",     wordB: "🎵" },
    { id: 18, wordA: "umbrella",  wordB: "☂️" },
    { id: 19, wordA: "lightning", wordB: "⚡" },
    { id: 20, wordA: "coffee",    wordB: "☕" }
  ];
  const PAIR_COUNT = 6;  // always 6 pairs per game

  let selected = [], matched = [], score = 0, timeLeft = 60, timer = null;
  let currentMode = 'emoji-word';

  const board      = document.getElementById('game-board');
  const timerEl    = document.getElementById('timer');
  const scoreEl    = document.getElementById('score');
  const gameOverEl = document.getElementById('game-over');
  const startBtn   = document.getElementById('start-btn');

  startBtn.addEventListener('click', startGame);

  function startGame() {
    // read which mode was picked
    currentMode = document.querySelector('input[name="mode"]:checked').value;

    // reset UI/state
    startBtn.disabled   = true;
    board.innerHTML     = '';
    selected = [];
    matched  = [];
    score     = 0;
    timeLeft  = 60;
    scoreEl.textContent = 'Score: 0';
    timerEl.textContent = timeLeft;
    gameOverEl.style.display = 'none';
    gameOverEl.innerHTML   = '';

    // choose PAIR_COUNT items based on mode
    let items;
    if (currentMode === 'emoji-word') {
      // pick 6 random word⇆emoji pairs
      items = shuffle(allPairs).slice(0, PAIR_COUNT);
    } else {
      // pick 6 random emojis for classic memory
      const allEmojis      = allPairs.map(p => p.wordB);
      const chosenEmojis   = shuffle(allEmojis).slice(0, PAIR_COUNT);
      items = chosenEmojis.map((emoji, i) => ({ id: i+1, value: emoji }));
    }

    // build the 2×PAIRS cards
    const cards = [];
    if (currentMode === 'emoji-word') {
      items.forEach(item => {
        cards.push({ type: 'A', value: item.wordA, id: item.id });
        cards.push({ type: 'B', value: item.wordB, id: item.id });
      });
    } else {
      items.forEach(item => {
        cards.push({ type: 'single', value: item.value, id: item.id });
        cards.push({ type: 'single', value: item.value, id: item.id });
      });
    }
    shuffle(cards);

    // render them
    cards.forEach(card => {
      const el = document.createElement('div');
      el.className     = 'card';
      el.textContent   = 'Click';
      el.dataset.id    = card.id;
      el.dataset.type  = card.type;
      el.dataset.value = card.value;
      board.appendChild(el);
    });

    // bind click & timer
    board.removeEventListener('click', onCardClick);
    board.addEventListener('click', onCardClick);
    startTimer();
  }

  function onCardClick(e) {
    const el = e.target.closest('.card');
    if (!el || el.classList.contains('matched') || selected.includes(el)) return;

    // reveal + bold
    el.textContent = el.dataset.value;
    el.classList.add('flipped');
    selected.push(el);

    if (selected.length === 2) {
      const [first, second] = selected;
      let isMatch = false;

      if (currentMode === 'emoji-word') {
        isMatch =
          first.dataset.id    === second.dataset.id &&
          first.dataset.type !== second.dataset.type;
      } else {
        isMatch = first.dataset.value === second.dataset.value;
      }

      if (isMatch) {
        first.classList.add('matched');
        second.classList.add('matched');
        matched.push(first.dataset.id);
        score++;
        scoreEl.textContent = 'Score: ' + score;
        if (matched.length === PAIR_COUNT) {
          clearInterval(timer);
          endGame(true);
        }
      } else {
        // flip back after a moment
        setTimeout(() => {
          [first, second].forEach(cardEl => {
            cardEl.textContent = 'Click';
            cardEl.classList.remove('flipped');
          });
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
        endGame(false);
      }
    }, 1000);
  }

  function endGame(won) {
    board.innerHTML = '';
    if (won) {
      gameOverEl.innerHTML = `
        🎉 You Win!<br>
        Final Score: <span>${score}</span>
      `;
    } else {
      gameOverEl.innerHTML = `
        ⏰ Time's up!<br>
        Final Score: <span>${score}</span>
      `;
    }
    gameOverEl.style.display = 'block';
    startBtn.disabled = false;
  }

  // Fisher–Yates shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
});
