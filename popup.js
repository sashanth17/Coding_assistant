
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
