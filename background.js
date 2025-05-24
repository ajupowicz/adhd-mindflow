let pomodoro = {};

function saveState() {
  chrome.storage.local.set({ pomodoro });
}

function schedulePhase() {
  chrome.alarms.clear("phaseEnd", () =>
    chrome.alarms.create("phaseEnd", { when: pomodoro.phaseEnd })
  );
}

function notify(title, msg) {
  chrome.notifications.create("", {
    type:    "basic",
    iconUrl: chrome.runtime.getURL("CSS/icons/tomato-svgrepo-com.png"),
    title,
    message: msg
  });
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.command === "toggleWhiteNoise") {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "toggleWhiteNoise" });
    }
  });
  return true;
}

  switch (req.action) {
    case "startPomodoro":
      pomodoro = {
        workMs:      req.work * 60000,
        breakMs:     req.breakT * 60000,
        totalRounds: req.rounds,
        round:       1,
        phase:       "work",
        paused:      false,
        phaseEnd:    Date.now() + req.work * 60000
      };
      saveState();
      schedulePhase();
      sendResponse({ status: "started" });
      break;

    case "pausePomodoro":
      if (!pomodoro.paused && pomodoro.phaseEnd) {
        pomodoro.remainingMs = pomodoro.phaseEnd - Date.now();
        pomodoro.paused = true;
        delete pomodoro.phaseEnd;
        saveState();
        chrome.alarms.clear("phaseEnd");
        sendResponse({ status: "paused" });
      } else {
        sendResponse({ status: "not_running" });
      }
      break;

    case "resumePomodoro":
      if (pomodoro.paused) {
        pomodoro.phaseEnd = Date.now() + pomodoro.remainingMs;
        pomodoro.paused   = false;
        delete pomodoro.remainingMs;
        saveState();
        schedulePhase();
        sendResponse({ status: "resumed" });
      } else {
        sendResponse({ status: "not_paused" });
      }
      break;

    case "stopPomodoro":
      chrome.alarms.clear("phaseEnd");
      pomodoro = {};
      chrome.storage.local.remove("pomodoro");
      sendResponse({ status: "stopped" });
      break;

    case "getPomodoroStatus":
      sendResponse({
        isRunning:    !!(pomodoro.phaseEnd || pomodoro.paused),
        isPaused:      !!pomodoro.paused,
        currentPhase:  pomodoro.phase  || null,
        currentRound:  pomodoro.round  || 0,
        totalRounds:   pomodoro.totalRounds || 0,
        remainingMs:   pomodoro.paused
                       ? pomodoro.remainingMs
                       : Math.max(0, pomodoro.phaseEnd - Date.now())
      });
      break;
  }
  return true;
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name !== "phaseEnd") return;
  if (pomodoro.phase === "work") {
    notify("Pomodoro", `Work ${pomodoro.round}/${pomodoro.totalRounds} done; break now!`);
    pomodoro.phase = "break";
    pomodoro.phaseEnd = Date.now() + pomodoro.breakMs;
  } else {
    if (pomodoro.round < pomodoro.totalRounds) {
      pomodoro.round++;
      notify("Pomodoro", `Round ${pomodoro.round}/${pomodoro.totalRounds} starting!`);
      pomodoro.phase = "work";
      pomodoro.phaseEnd = Date.now() + pomodoro.workMs;
    } else {
      notify("Pomodoro", "All rounds complete!");
      pomodoro = {};
      chrome.storage.local.remove("pomodoro");
      return;
    }
  }
  saveState();
  schedulePhase();
});
