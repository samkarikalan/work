let timerMinutes = 8;
let remainingSeconds = timerMinutes * 60;
let isRunning = false;

// Called by native every second
function onNativeTimerTick(seconds) {
  remainingSeconds = seconds;
  updateTimerDisplay();
}

// Called by native when timer finishes
function onNativeTimerFinished() {
  isRunning = false;
  updateTimerDisplay();
  playBeep();
}

function updateTimerDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// + / − buttons
document.getElementById("timerPlus").onclick = () => {
  if (!isRunning && timerMinutes < 30) {
    timerMinutes++;
    remainingSeconds = timerMinutes * 60;
    updateTimerDisplay();
  }
};

document.getElementById("timerMinus").onclick = () => {
  if (!isRunning && timerMinutes > 1) {
    timerMinutes--;
    remainingSeconds = timerMinutes * 60;
    updateTimerDisplay();
  }
};

// Toggle timer
function toggleTimer() {
  const btn = document.getElementById("timerToggleBtn");

  if (!isRunning) {
    isRunning = true;
    btn.classList.add("running");
    Android.startTimer(remainingSeconds);
  } else {
    isRunning = false;
    btn.classList.remove("running");
    Android.stopTimer();
  }
}

// Alarm logic stays the same
function playBeep() {
  const sound = document.getElementById("timerSound");
  sound.currentTime = 0;
  sound.play().catch(() => {});
}
