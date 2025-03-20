document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');
    const userInputField = document.getElementById('user-input');

    if (backbtn) {
        backbtn.addEventListener("click", function () {
            window.location.href = "popup.html";  // ✅ Redirects safely
        });
    }

    const sendMessage = () => {
        const userInput = userInputField.value.trim();
        if (!userInput) return;

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = "message user";
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);
        userInputField.value = '';

        // 🔥 Retrieve Code from Local Storage
        chrome.storage.local.get("userCode", function (data) {
            if (!data.userCode) {
                const errorMessage = document.createElement('div');
                errorMessage.className = "message bot";
                errorMessage.textContent = "⚠️ Error: No code found in storage.";
                chatBox.appendChild(errorMessage);
                return;
            }

            let userCode = data.userCode; // Store in variable

            // 🔥 Improved, Friendlier, & More Helpful Prompt
            let prompt = `You are an AI coding mentor that **helps users refine their code**. Keep responses **short, friendly, and helpful**. **Follow these rules strictly**:

🔹 **If there are syntax errors**:  
   - Mention them clearly and **suggest a fix**, but do **not rewrite the code**.  
   - Example: **"You forgot a semicolon at line X."**  

🔹 **If there are logical errors**:  
   - Explain **why** the logic is incorrect and **suggest a fix**.  
   - Example: **"Your loop condition causes an infinite loop. Try using <= instead of <."**  

❌ **Do NOT provide the entire corrected code**.  

🤔 **If the user is struggling with implementation**:  
   - Give a **small hint** on how to proceed, but **do NOT write the solution**.  
   - Example: **"Think about using a hash map to optimize lookups."**  

👉 **Problem Statement:** ${userCode}  
👉 **User's Code:** "${userInput}"`;

            // 🔥 Fetch response from Gemini API
            fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const botMessage = document.createElement('div');
                    botMessage.className = "message bot";
                    const markdownText = data.candidates[0].content.parts[0].text;
                    botMessage.innerHTML = marked.parse(markdownText); // ✅ Convert Markdown to HTML
                    chatBox.appendChild(botMessage);
                } else {
                    console.error("Invalid response format:", data);
                }
            })
            .catch(error => console.error("Error fetching response:", error));
        });
    };

    // Click event for send button
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Enter key event for input field
    if (userInputField) {
        userInputField.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents form submission or new line
                sendMessage();
            }
        });
    }
});
