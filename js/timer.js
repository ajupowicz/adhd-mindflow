document.addEventListener("DOMContentLoaded", () => {
  const settingsDiv = document.getElementById("settings");
  const runningDiv  = document.getElementById("running");
  const displayRnd  = document.getElementById("displayRound");
  const displayTm   = document.getElementById("displayTimer");
  const btnStart    = document.getElementById("startPomodoro");
  const btnPause    = document.getElementById("pausePomodoro");
  const btnStop     = document.getElementById("stopPomodoro");
  let intervalId = null;

  function showSettings() {
    clearInterval(intervalId);
    intervalId = null;
    btnPause.textContent = "Pause";
    runningDiv.classList.add("hidden");
    settingsDiv.classList.remove("hidden");
  }

  function startLoop() {
    settingsDiv.classList.add("hidden");
    runningDiv.classList.remove("hidden");
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      chrome.runtime.sendMessage({ action: "getPomodoroStatus" }, resp => {
        if (!resp.isRunning) {
          showSettings();
          return;
        }
        displayRnd.textContent = `Round ${resp.currentRound}/${resp.totalRounds}`;
        const totalSec = Math.floor(resp.remainingMs / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const phase = resp.isPaused
          ? "Paused"
          : resp.currentPhase.charAt(0).toUpperCase() + resp.currentPhase.slice(1);
        displayTm.textContent = `${phase}: ${m}:${s.toString().padStart(2, "0")}`;
      });
    }, 500);
  }

  btnStart.addEventListener("click", () => {
    const work   = parseInt(document.getElementById("workTime").value, 10);
    const brk    = parseInt(document.getElementById("breakTime").value, 10);
    const rounds = parseInt(document.getElementById("repetitions").value, 10);
    chrome.runtime.sendMessage(
      { action: "startPomodoro", work, breakT: brk, rounds },
      () => startLoop()
    );
  });

  btnPause.addEventListener("click", () => {
    const cmd = btnPause.textContent === "Pause" 
      ? "pausePomodoro" : "resumePomodoro";
    chrome.runtime.sendMessage({ action: cmd }, resp => {
      if (resp.status === "paused") {
        btnPause.textContent = "Resume";
      } else if (resp.status === "resumed") {
        btnPause.textContent = "Pause";
        startLoop();
      }
    });
  });

  btnStop.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopPomodoro" }, showSettings);
  });

  // na starcie: ukryj widok odliczania, sprawdź czy już leci timer
  showSettings();
  chrome.runtime.sendMessage({ action: "getPomodoroStatus" }, resp => {
    if (resp.isRunning) startLoop();
  });
});
