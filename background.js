
let whiteNoise = new Audio("sounds/white-noise.mp3");
whiteNoise.loop = true;
whiteNoise.volume = 0.5;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "playWhiteNoise") {
        whiteNoise.play();
        sendResponse({ status: "playing" });
    }
    if (request.command === "pauseWhiteNoise") {
        whiteNoise.pause();
        sendResponse({ status: "paused" });
    }
});
