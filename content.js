(function () {
  function waitForVideo(callback) {
    const tryFindVideo = () => {
      const video = document.querySelector('video');
      if (video) callback(video);
    };
    tryFindVideo();
    const observer = new MutationObserver(() => tryFindVideo());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function createOverlay(video, question) {
    if (document.getElementById('quiz-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'quiz-overlay';
    overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const questionText = document.createElement('p');
    questionText.style.fontSize = '24px';
    questionText.style.textAlign = 'center';
    questionText.textContent = question;
    overlay.appendChild(questionText);

    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'Continue watching';
    resumeButton.style.padding = '10px 20px';
    resumeButton.style.fontSize = '16px';
    resumeButton.style.marginTop = '20px';
    resumeButton.onclick = function () {
      overlay.remove();
      video.muted = false;
      video.volume = 1;
      video.play().catch(console.warn);
    };
    overlay.appendChild(resumeButton);

    document.body.appendChild(overlay);
  }

  function generateQuestion() {
    const questions = [
      "What do you remember from this part?",
      "What emotions did this moment evoke?",
      "What was the main message of this section?",
      "Do you understand the message of this part?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function randomPause(video) {
    setInterval(() => {
      if (!video.paused && !document.getElementById('quiz-overlay')) {
        if (Math.random() < 0.1) {
          video.pause();
          createOverlay(video, generateQuestion());
        }
      }
    }, 30000); // co 30 sekund
  }

  function startLogic() {
    waitForVideo(video => {
      randomPause(video); // pauzy są domyślnie WŁĄCZONE, bez ustawień
    });
  }

  startLogic();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      startLogic();
    }
  }).observe(document, { subtree: true, childList: true });
})();

// 🎧 White noise
let whiteNoise = null;
chrome.runtime.onMessage.addListener((request) => {
  if (request.command === "toggleWhiteNoise") {
    if (!whiteNoise) {
      whiteNoise = new Audio(chrome.runtime.getURL("sounds/white-noise.mp3"));
      whiteNoise.loop = true;
      whiteNoise.volume = 0.5;
      whiteNoise.play();
    } else if (whiteNoise.paused) {
      whiteNoise.play();
    } else {
      whiteNoise.pause();
    }
  }
});
