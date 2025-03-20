function saveProblemStatement() {
    // Select the problem container
    const problemContainer = document.querySelector("div.elfjS");
    const currentPageUrl = window.location.href;
    if (problemContainer) {
        // Extract text from all elements inside the container
        const problemText = problemContainer.innerHTML.trim(); // ✅ Keeps formatting

        // Store in Chrome local storage
        chrome.storage.local.set({ [currentPageUrl]: problemText }, function() {
            if (chrome.runtime.lastError) {
                console.error("Error saving:", chrome.runtime.lastError);
                return;
            }
            console.log("Problem statement saved:", problemText);
        });
    } else {
        console.log("Problem statement not found. Check the selector.");
    }
}

// Run the function
saveProblemStatement();

document.addEventListener("DOMContentLoaded", function () {
    // Select the target container using its class
    const targetContainer = document.querySelector(
        ".flexlayout__tabset_tabbar_inner_tab_container.flexlayout__tabset_tabbar_inner_tab_container_top"
    );

    if (targetContainer) {
        // Create a new button
        let button = document.createElement("button");
        button.innerText = "Save Selection";
        button.style.padding = "6px 12px";  // Increased padding for better appearance
        button.style.marginLeft = "10px";   // Adds space between button and other elements
        button.style.cursor = "pointer";
        button.style.background = "var(--gray-40)";  // ✅ Use existing theme color
        button.style.color = "white";
        button.style.border = "2px solid lightgreen";  // ✅ Light green border
        button.style.borderRadius = "8px";  // ✅ Rounded border for a smooth look

        // Add an event listener to the button
        button.addEventListener("click", function () {
            alert("Button Clicked!");
        });

        // Append the button inside the target container
        targetContainer.appendChild(button);
    } else {
        console.log("Target container not found. Check the class name.");
    }
});



// Create a button dynamically
let button = document.createElement("button");
button.innerText = "Save Selection";
button.style.position = "fixed";
button.style.top = "49px";
button.style.left = "1090px";
button.style.padding = "6px";
button.style.background = "var(--gray-40)"; 
button.style.color = "var(--gray-60)";
button.style.border = "2px solid lightgreen";  
button.style.borderRadius = "8px"; 
button.style.cursor = "pointer";

// Append button to the document body
document.body.appendChild(button);

// Add click event to save selected text to Chrome storage
button.addEventListener("click", function() {
    let selectedText = window.getSelection().toString().trim();
    let currentPageUrl = window.location.href; // ✅ Use `let` to modify it
    let codeKey = currentPageUrl + "_Code";  // ✅ Correctly append "_Code"

    if (selectedText) {
        chrome.storage.local.set({ [codeKey]: selectedText }, function() {
            if (chrome.runtime.lastError) {
                console.error("Error saving:", chrome.runtime.lastError);
                return;
            }
            alert("Selected text saved: " + selectedText); // ✅ Corrected alert
        });
    } else {
        alert("No text selected!");
    }
});