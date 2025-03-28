document.addEventListener('DOMContentLoaded', function () {
    let pomodoroInterval;
    let currentPhase = 'work';
    let currentRound = 0;
    let remainingTime = 0;
    let totalRounds = 0;
    let workDuration = 0;
    let breakDuration = 0;

    const pomodoroStatus = document.getElementById('pomodoroStatus');
    const startButton = document.getElementById('startPomodoro');
    const stopButton = document.getElementById('stopPomodoro');

    function updatePomodoroStatus() {
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        pomodoroStatus.textContent = `Round ${currentRound} of ${totalRounds} - ${currentPhase === 'work' ? 'Work' : 'Break'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function startPomodoroTimer() {
        const workInput = parseInt(document.getElementById('workTime').value, 10) || 25;
        const breakInput = parseInt(document.getElementById('breakTime').value, 10) || 5;
        totalRounds = parseInt(document.getElementById('repetitions').value, 10) || 4;

        workDuration = workInput * 60;
        breakDuration = breakInput * 60;
        currentRound = 1;
        currentPhase = 'work';
        remainingTime = workDuration;
        updatePomodoroStatus();

        pomodoroInterval = setInterval(() => {
            remainingTime--;
            if (remainingTime < 0) {
                if (currentPhase === 'work') {
                    currentPhase = 'break';
                    remainingTime = breakDuration;
                } else {
                    if (currentRound < totalRounds) {
                        currentRound++;
                        currentPhase = 'work';
                        remainingTime = workDuration;
                    } else {
                        clearInterval(pomodoroInterval);
                        pomodoroStatus.textContent = 'Timer finished!';
                        return;
                    }
                }
            }
            updatePomodoroStatus();
        }, 1000);
    }

    startButton.addEventListener('click', startPomodoroTimer);
    stopButton.addEventListener('click', function () {
        clearInterval(pomodoroInterval);
        pomodoroStatus.textContent = 'Timer stopped.';
    });

    // Notepad
    const notepad = document.getElementById('notepad');
    const saveNotesButton = document.getElementById('saveNotesButton');
    const saveStatus = document.getElementById('saveStatus');

    if (localStorage.getItem('notepadContent')) {
        notepad.value = localStorage.getItem('notepadContent');
    }

    saveNotesButton.addEventListener('click', function () {
        localStorage.setItem('notepadContent', notepad.value);
        saveStatus.textContent = 'Notes saved!';
        setTimeout(() => { saveStatus.textContent = ''; }, 2000);
    });
});

// ✅ Global function so it works with onclick="startGame()"
function startGame() {
    const gameContainer = document.getElementById("game-colors");
    const resultDisplay = document.getElementById("game-score");
    gameContainer.style.display = "block";
    resultDisplay.textContent = "";
    gameContainer.innerHTML = "";

    const availableColors = ["red", "green", "blue", "yellow", "purple", "orange"];
    const memorizedColors = [];
    const chosenColors = [];
    let step = 0;

    while (memorizedColors.length < 3) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        if (!memorizedColors.includes(randomColor)) {
            memorizedColors.push(randomColor);
        }
    }

    memorizedColors.forEach(color => {
        const square = document.createElement("div");
        square.style.width = "50px";
        square.style.height = "50px";
        square.style.background = color;
        square.style.display = "inline-block";
        square.style.margin = "5px";
        gameContainer.appendChild(square);
    });

    setTimeout(() => {
        gameContainer.innerHTML = "";
        const shuffled = memorizedColors.slice().sort(() => 0.5 - Math.random());
        shuffled.forEach(color => {
            const button = document.createElement("button");
            button.textContent = color;
            button.onclick = () => {
                chosenColors.push(color);
                step++;
                if (step === 3) {
                    const resultText = JSON.stringify(chosenColors) === JSON.stringify(memorizedColors)
                        ? "Congratulations, you selected the correct sequence!"
                        : "Oops, wrong order.";
                    resultDisplay.textContent = resultText;
                    gameContainer.style.display = "none";
                }
            };
            gameContainer.appendChild(button);
        });
    }, 5000);
}
