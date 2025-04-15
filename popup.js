
document.getElementById("btn-timer").onclick = () =>
    chrome.windows.create({
        url: "timer.html",
        type: "popup",
        width: 400,
        height: 420
    });

document.getElementById("btn-notes").onclick = () =>
    chrome.windows.create({
        url: "notes.html",
        type: "popup",
        width: 400,
        height: 420
    });

document.getElementById("btn-game").onclick = () =>
    chrome.windows.create({
        url: "game.html",
        type: "popup",
        width: 400,
        height: 420
    });

document.getElementById("btn-noise").onclick = () =>
    chrome.windows.create({
        url: "whitenoise.html",
        type: "popup",
        width: 400,
        height: 420
    });
