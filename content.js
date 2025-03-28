(function () {
    let video = document.querySelector('video');
    if (!video) return;

    function createOverlay(question) {
        let overlay = document.createElement('div');
        overlay.id = 'quiz-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.color = '#fff';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        let questionText = document.createElement('p');
        questionText.style.fontSize = '24px';
        questionText.style.textAlign = 'center';
        questionText.textContent = question;
        overlay.appendChild(questionText);

        let resumeButton = document.createElement('button');
        resumeButton.textContent = 'Continue watching';
        resumeButton.style.padding = '10px 20px';
        resumeButton.style.fontSize = '16px';
        resumeButton.style.marginTop = '20px';
        resumeButton.onclick = function () {
            overlay.remove();
            video.play();
        };
        overlay.appendChild(resumeButton);

        document.body.appendChild(overlay);
    }

    function generateQuestion() {
        let sampleQuestions = [
            "What do you remember from this part?",
            "What emotions did this moment evoke?",
            "What was the main message of this section?",
            "Do you understand the message of this part?"
        ];
        let randomIndex = Math.floor(Math.random() * sampleQuestions.length);
        return sampleQuestions[randomIndex];
    }

    function randomPause() {
        setInterval(() => {
            if (!video.paused) {
                if (Math.random() < 0.1) {
                    video.pause();
                    let question = generateQuestion();
                    createOverlay(question);
                }
            }
        }, 5000);
    }

    randomPause();
})();
