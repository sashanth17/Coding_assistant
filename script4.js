document.addEventListener("DOMContentLoaded", function () {
    const backBtn = document.getElementById("backbtn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    // Go Back Button
    backBtn.addEventListener("click", function () {
        window.history.back();
    });

    // Send Message
    sendBtn.addEventListener("click", function () {
        sendMessage();
    });

    // Enter Key to Send Message
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        let message = userInput.value.trim();
        if (message === "") return;

        // User message
        let userMessage = document.createElement("div");
        userMessage.classList.add("message", "user");
        userMessage.textContent = message;
        chatBox.appendChild(userMessage);

        userInput.value = ""; // Clear input

        // Auto reply (Placeholder response)
        setTimeout(() => {
            let botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot");
            botMessage.textContent = "Hi there! How can I help you today?";
            chatBox.appendChild(botMessage);

            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
        }, 500);
    }

    // Auto-fill user input with selected text
    document.addEventListener("mouseup", function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            userInput.value = selectedText;
        }
    });

    document.addEventListener("touchend", function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            userInput.value = selectedText;
        }
    });
});
