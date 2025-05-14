const container = document.getElementById('container');
const panel     = document.getElementById('panel-container');
const iframe    = document.getElementById('iframe-content');
const closeBtn  = document.getElementById('panel-close');
const btnClose  = document.getElementById('btn-close');

function loadSection(url) {
  iframe.src = url;
  panel.classList.add('active');
  container.classList.add('expanded');
}

document.getElementById("btn-timer").onclick = () =>
  loadSection("timer.html");

document.getElementById("btn-notes").onclick = () =>
  loadSection("notes.html");

document.getElementById("btn-game").onclick = () =>
  loadSection("game.html");

// Zamknięcie panelu (wewnętrzny krzyżyk)
closeBtn.onclick = () => {
  panel.classList.remove('active');
  container.classList.remove('expanded');
};

// Zamknięcie całego popupu (dolny X)
btnClose.onclick = () => {
  window.close();
};


document.getElementById('btn-noise').addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: "toggleWhiteNoise" });
});