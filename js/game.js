// Musi być w globalnym zakresie!

console.log("✅ game.js załadowany");
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

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("start-btn");
    if (btn) {
      btn.addEventListener("click", startGame);
    }
  });