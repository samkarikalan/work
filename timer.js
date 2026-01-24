let timerMinutes = 8;
let remainingSeconds = timerMinutes * 60;
let isRunning = false;
let alarmTimeout = null;
let alarmRepeatTimeout = null;
let audioUnlocked = false;

// ----------------------------
// Display update
// ----------------------------
function updateTimerDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// ----------------------------
// + / − buttons
// ----------------------------
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

// ----------------------------
// Audio unlock for mobile
// ----------------------------
function unlockAudio() {
  if (audioUnlocked) return;
  const sound = document.getElementById("timerSound");
  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
    audioUnlocked = true;
  }).catch(() => {});
}

// ----------------------------
// Toggle timer
// ----------------------------
function toggleTimer() {
  unlockAudio();
  const btn = document.getElementById("timerToggleBtn");

  if (!isRunning) {
    isRunning = true;
    btn.classList.add("running");
    Android.startTimer(remainingSeconds);   // 🔥 Native timer start
  } else {
    isRunning = false;
    btn.classList.remove("running");
    Android.pauseTimer();                  // 🔥 Native pause
  }
}

// ----------------------------
// Stop / Reset timer
// ----------------------------
function stopTimer() {
  isRunning = false;
  document.getElementById("timerToggleBtn").classList.remove("running");
  Android.stopTimer();                     // 🔥 Native stop
  stopAlarm();

  remainingSeconds = timerMinutes * 60;
  updateTimerDisplay();
}

// ----------------------------
// Native → JS callbacks
// ----------------------------
function onNativeTimerTick(seconds) {
  remainingSeconds = seconds;
  updateTimerDisplay();
}

function onNativeTimerFinished() {
  stopTimer();
  playBeep();
}

// ----------------------------
// Alarm
// ----------------------------
function playBeep() {
  const sound = document.getElementById("timerSound");
  stopAlarm();

  let count = 0;
  function playOnce() {
    sound.currentTime = 0;
    sound.play().catch(() => {});
    count++;
    if (count < 20) {
      alarmRepeatTimeout = setTimeout(playOnce, 1500);
    }
  }

  playOnce();

  alarmTimeout = setTimeout(() => {
    stopAlarm();
  }, 30000);
}

function stopAlarm() {
  const sound = document.getElementById("timerSound");
  sound.pause();
  sound.currentTime = 0;

  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }

  if (alarmRepeatTimeout) {
    clearTimeout(alarmRepeatTimeout);
    alarmRepeatTimeout = null;
  }
}

// ----------------------------
// Initialize
// ----------------------------
remainingSeconds = timerMinutes * 60;
updateTimerDisplay();
