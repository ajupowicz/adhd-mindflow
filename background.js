
// let whiteNoise = new Audio("sounds/white-noise.mp3");
// whiteNoise.loop = true;
// whiteNoise.volume = 0.5;

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.command === "playWhiteNoise") {
//         whiteNoise.play();
//         sendResponse({ status: "playing" });
//     }
//     if (request.command === "pauseWhiteNoise") {
//         whiteNoise.pause();
//         sendResponse({ status: "paused" });
//     }
// });

//dodane
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "toggleWhiteNoise") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { command: "toggleWhiteNoise" });
        }
      });
    }
  });