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

        // 🔥 Retrieve Problem Statement from Local Storage
        chrome.storage.local.get("problemStatement", async (data) => {
            if (!data.problemStatement) {
                const errorMessage = document.createElement('div');
                errorMessage.className = "message bot";
                errorMessage.textContent = "⚠️ Error: No problem statement found in storage.";
                chatBox.appendChild(errorMessage);
                return;
            }

            let problemStatement = data.problemStatement; // Store in variable

            // 🔥 Improved, Friendlier, & More Helpful Prompt
            let prompt = `You are an AI coding mentor that **helps users refine their coding approaches**. Keep responses **short, friendly, and helpful**. **Follow these rules**:

            ✅ **If the approach is correct**:  
               - Say **"Yes! That works. Try implementing it."**  
               - Optionally suggest an **edge case** to check.

            ⚠️ **If the approach is partially correct**:  
               - Acknowledge it: **"You're on the right track!"**  
               - Point out what needs improvement and **give a small hint**.

            ❌ **If the approach is wrong**:  
               - Say **"Not quite! The issue is [brief reason]."**  
               - Suggest a **better approach** in one sentence.

            🤔 **If the user is stuck**:  
               - Give a **small hint**, not the full solution.

            🔹 **If they ask for the technique name, tell them directly**.  
               - Example: **"This is best solved using a greedy approach."**

            👉 **Problem Statement:** ${problemStatement}  
            👉 **User's Approach:** "${userInput}"`;

            try {
                // Fetch response from Gemini API
                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();

                if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const botMessage = document.createElement('div');
                    botMessage.className = "message bot";
                    botMessage.textContent = data.candidates[0].content.parts[0].text;
                    chatBox.appendChild(botMessage);
                } else {
                    console.error("Invalid response format:", data);
                }

            } catch (error) {
                console.error("Error fetching response:", error);
            }
        });
    });
});
