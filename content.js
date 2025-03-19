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

// Create a button dynamically
let button = document.createElement("button");
button.innerText = "Save Selection";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.padding = "10px";
button.style.background = "lightgrey"; // Fixed color issue
button.style.color = "white";
button.style.border = "none";
button.style.cursor = "pointer";

// Append button to the document body
document.body.appendChild(button);

// Add click event to save selected text to Chrome storage
button.addEventListener("click", function() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.storage.local.set({ userCode: selectedText }, function() {
            if (chrome.runtime.lastError) {
                console.error("Error saving:", chrome.runtime.lastError);
                return;
            }
            alert("Selected text saved: " + selectedText); // Fixed alert issue
        });
    } else {
        alert("No text selected!");
    }
});