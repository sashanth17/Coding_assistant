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

        // Fixed Prompt Logic
        let prompt = `You are a coding assistant. Follow these rules strictly:
        1. If the user asks if an incorrect approach (like "graph traversal" for an array problem) can be used, **immediately say NO** and give a brief reason.
        2. If the user asks if a correct approach can be used, say "Yes" and encourage them to try implementing it.
        3. If the user shares their approach:
           - If correct, say "Yes, your approach is correct! Try implementing it."
           - If wrong, say "No, that approach won’t work because [brief reason]. Try using [correct approach]."
        4. If the user doesn’t know an approach, **immediately provide a small hint**.
        5. Do NOT ask unnecessary follow-up questions like 'What nodes/edges do you have in mind?' unless it's a valid approach.
        6. Do NOT generate full code. Just guide the user toward solving it themselves.
        
        Now, based on these rules, respond to the user’s input: "${userInput}"`;

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
});
