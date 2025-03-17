let timeSpent = 0;

// Increment timer every minute
setInterval(() => {
    timeSpent++;
    chrome.storage.local.set({ timeSpent });
}, 60000);

// Reset timer when tab is changed
chrome.tabs.onActivated.addListener(() => {
    timeSpent = 0;
    chrome.storage.local.set({ timeSpent });
});
