// grab main elements
const container = document.getElementById('container');
const panel     = document.getElementById('panel-container');
const iframe    = document.getElementById('iframe-content');
const closeBtn  = document.getElementById('panel-close');
const btnClose  = document.getElementById('btn-close');

// Helper to load a section into the iframe
function loadSection(url) {
  iframe.src = url;
  panel.classList.add('active');
  container.classList.add('expanded');
}

// wire up the left-panel buttons
document.getElementById('btn-timer').onclick = () =>
  loadSection('timer.html');

document.getElementById('btn-notes').onclick = () =>
  loadSection('notes.html');

document.getElementById('btn-game').onclick = () =>
  loadSection('game.html');

// ─── White Noise toggle + icon swap ───────────────────────
const noiseBtn  = document.getElementById('btn-noise');
const noiseIcon = document.getElementById('noise-icon');
let noiseOn     = false;

noiseBtn.addEventListener('click', () => {
  // flip state
  noiseOn = !noiseOn;

  // swap SVG (using your exact filename)
  noiseIcon.src = noiseOn
    ? 'css/icons/headphonescrossed-svgrepo-com.svg'
    : 'css/icons/headphones-svgrepo-com.svg';

  // send your existing message to start/stop noise
  chrome.runtime.sendMessage({ command: 'toggleWhiteNoise' });
});

// close the left panel
closeBtn.onclick = () => {
  panel.classList.remove('active');
  container.classList.remove('expanded');
};
const settingBtn = document.getElementById('btn-settings');

if (settingBtn) {
  settingBtn.addEventListener('click', () => {
    chrome.storage.local.get('videoQuizDisabled', data => {
      const isDisabled = data?.videoQuizDisabled === true;
      const toggle = confirm(
        isDisabled
          ? "Enable reflection questions during video watching?"
          : "Disable reflection questions during video watching?"
      );
      chrome.storage.local.set({ videoQuizDisabled: !toggle });
    });
  });
}
// close the entire popup
btnClose.onclick = () => {
  window.close();
};
