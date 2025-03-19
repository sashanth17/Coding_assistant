document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");

    backbtn.addEventListener("click", function () {
        window.location.href = "popup.html";  // ✅ Redirects safely
    });

    document.getElementById('send-btn').addEventListener('click', async function() {
        const userInput = document.getElementById('user-input').value.trim();
        if (!userInput) return;

        const chatBox = document.getElementById('chat-box');

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = "message user";
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);

        document.getElementById('user-input').value = '';

        try {
            // Fetch response from Gemini API
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: userInput }] }]
                })
            });

            const data = await response.json();

            if (data?.candidates?.length > 0) {
                const botMessage = document.createElement('div');
                botMessage.className = "message bot";
                
                // Process API response text and convert markdown-like formatting to HTML
                let formattedText = data.candidates[0].content.parts[0].text
                    .replace(/🔹 \*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert bold sections
                    .replace(/\* Input:/g, '<br><strong>Input:</strong>')   // Format input/output
                    .replace(/\* Output:/g, '<strong>Output:</strong>')
                    .replace(/\n/g, '<br>'); // Convert new lines to HTML line breaks
                
                botMessage.innerHTML = formattedText;
                chatBox.appendChild(botMessage);
            } else {
                console.error("Invalid response:", data);
            }

        } catch (error) {
            console.error("Error fetching response:", error);
        }
    });

    // ✅ Text Selection Functionality
    document.addEventListener("mouseup", function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            let inputBox = document.getElementById("user-input");
            if (inputBox) {
                inputBox.value = selectedText;
            }
        }
    });

    document.addEventListener("touchend", function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            let inputBox = document.getElementById("user-input");
            if (inputBox) {
                inputBox.value = selectedText;
            }
        }
    });
});
