function checkAndStoreAPIKey(storageKey) {
    chrome.storage.local.get([storageKey], function(result) {
        if (result[storageKey]) {
            console.log("API Key already stored:", result[storageKey]);
        } else {
            let apiKey = prompt("Enter your API Key:");
            if (apiKey) {
                let storageObj = {};
                storageObj[storageKey] = apiKey;
                chrome.storage.local.set(storageObj, function() {
                    console.log("API Key stored successfully.");
                });
            } else {
                console.log("No API Key entered.");
            }
        }
    });
}

// Example Usage
checkAndStoreAPIKey("userAPIKey");
document.addEventListener("DOMContentLoaded", function () {
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
