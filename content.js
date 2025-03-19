function saveProblemStatement() {
    // Select the problem container
    const problemContainer = document.querySelector('div.elfjS');

    if (problemContainer) {
        // Extract text from all elements inside the container
        const problemText = problemContainer.innerText.trim();

        // Store in Chrome local storage
        chrome.storage.local.set({ problemStatement: problemText }, () => {
            console.log("Problem statement saved:", problemText);
        });
    } else {
        console.log("Problem statement not found. Check the selector.");
    }
}

// Run the function
saveProblemStatement();
