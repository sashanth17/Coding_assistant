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
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: `
You are a coding assistant that provides **only problem explanations** when asked.  
- **Explain in short and simple bullet points** (not long paragraphs).  
- **If the user greets, respond normally.**  
- **When asked for a problem explanation, break it down like this:**
  - 🔹 **What the problem is asking** (1-2 sentences)
  - 🔹 **How to think about solving it** (basic idea)
  - 🔹 **Important constraints & edge cases** (if any)
  - 🔹 **Example input & output** (keep it simple)
- **After explaining, ask:**
  _"Was this explanation clear? If not, I can simplify it more."_

🚨 **IMPORTANT RULES:**  
❌ **Never give a full solution or code.**  
❌ **If asked for a solution, reply:**  
   _"Try solving it for a few minutes! If you're stuck, I can give hints."_  
✅ **If they ask for hints, give small hints without revealing the full solution.**  

User Input: "${userInput}"
                            `
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data?.candidates?.length > 0) {
                const botMessage = document.createElement('div');
                botMessage.className = "message bot";
                botMessage.textContent = data.candidates[0].content.parts[0].text;
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
