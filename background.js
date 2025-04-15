
let whiteNoise = new Audio("sounds/white-noise.mp3");
whiteNoise.loop = true;

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
