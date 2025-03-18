let timer;
let isRunning = false;
let seconds = 0;

const timerDisplay = document.getElementById("timer");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");

function updateTimerDisplay() {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startPauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        startPauseBtn.textContent = "Start";
    } else {
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
        startPauseBtn.textContent = "Pause";
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0;
    updateTimerDisplay();
    startPauseBtn.textContent = "Start";
}

// Event Listeners
startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize display
updateTimerDisplay();