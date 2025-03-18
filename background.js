chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ timerValue: 0, timerRunning: false });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "timerAlarm") {
        chrome.storage.local.get(["timerValue", "timerRunning"], (data) => {
            if (data.timerRunning) {
                chrome.storage.local.set({ timerValue: data.timerValue + 1 });
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        chrome.storage.local.set({ timerRunning: true }, () => {
            chrome.alarms.create("timerAlarm", { periodInMinutes: 1 / 60 }); // Runs every second
        });
    } else if (message.action === "resetTimer") {
        chrome.storage.local.set({ timerValue: 0, timerRunning: false }, () => {
            chrome.alarms.clear("timerAlarm");
        });
    }
});