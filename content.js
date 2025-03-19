// Auto-fill user input with selected text
document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        userInput.value = selectedText;  // Fill input field
    }
});

document.addEventListener("touchend", function () {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        userInput.value = selectedText;
    }
});

// Create a button
let btn = document.createElement("button");
btn.textContent = "Save Text";

// Style the button
btn.style.position = "fixed";
btn.style.top = "10px";
btn.style.left = "10px";
btn.style.zIndex = "1000";
btn.style.padding = "10px";
btn.style.backgroundColor = "blue";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "5px";

// Append button to the webpage
document.body.appendChild(btn);

// Handle button click to save selected text in Chrome Storage
btn.addEventListener("click", function () {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.storage.local.set({ savedText: selectedText }, function () {
            alert("Text saved successfully!");
        });
    } else {
        alert("Please select some text before saving.");
    }
});