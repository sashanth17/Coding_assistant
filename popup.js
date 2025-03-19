const timerDisplay = document.getElementById("timer");

function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Check and update the timer every second
function fetchTimer() {
    chrome.storage.local.get("timerValue", (data) => {
        updateTimerDisplay(data.timerValue || 0);
    });
}

// Start the timer only if it's the first time
chrome.storage.local.get("timerRunning", (data) => {
    if (!data.timerRunning) {
        chrome.runtime.sendMessage({ action: "startTimer" });
    }
});

// Update the display every second when the popup is open
setInterval(fetchTimer, 1000);
fetchTimer();

document.addEventListener("DOMContentLoaded", function () {
    const pauseBtn = document.getElementById("PauseBtn");

    // Check the stored timer state and set the button text accordingly
    chrome.storage.local.get(["timerRunning"], (data) => {
        if (data.timerRunning === undefined) {
            // Default state: assume timer is running, set it once
            chrome.storage.local.set({ timerRunning: true }, () => {
                pauseBtn.textContent = "Pause"; // Set text only after storage update
            });
        } else {
            pauseBtn.textContent = "Pause";
        }
    });

    // Event Listener for Pause/Resume Button
    pauseBtn.addEventListener("click", function () {
        chrome.storage.local.get(["timerRunning"], (data) => {
            const isRunning = data.timerRunning;
            const newState = !isRunning;

            chrome.storage.local.set({ timerRunning: newState }, () => {
                pauseBtn.textContent = newState ? "Pause" : "Resume";
                
                // Send message to background script to pause/resume the timer
                chrome.runtime.sendMessage({ action: newState ? "resumeTimer" : "pauseTimer" });
            });
        });
    });

    document.getElementById("explainBtn").addEventListener("click", () => window.location.href = "page2.html");
    document.getElementById("approachbtn").addEventListener("click", () => window.location.href = "page3.html");
    document.getElementById("solutionbtn").addEventListener("click", () => window.location.href = "page4.html");
    document.getElementById("codebtn").addEventListener("click", () => window.location.href = "page5.html");

    // ✅ Feature: Move selected text to input box
    document.addEventListener("mouseup", function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            let inputBox = document.querySelector("#messageInput"); // Get the input box
            if (inputBox) {
                inputBox.value = selectedText; // Set the selected text in input
            }
        }
    });
});
