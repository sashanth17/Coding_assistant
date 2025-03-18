let timeSpent = 0;

setInterval(() => {
    timeSpent += 1;
    chrome.storage.local.set({ timeSpent });
}, 60000); // Increments every 1 minute
fy