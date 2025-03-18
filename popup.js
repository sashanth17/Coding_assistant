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

    document.querySelector(".task .btn").addEventListener("click", function() {
        window.location.href = "page2.html"; // Redirect to page2.html
    });