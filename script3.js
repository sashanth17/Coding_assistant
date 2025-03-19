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

        // 🔥 STRONGER PROMPT
        let prompt = `You are an AI coding assistant that **only provides explanations, hints, and guidance for solving coding problems**. 
        **Follow these strict rules when responding**:
        
        1️⃣ **Wrong Approach:** If the user asks if an incorrect approach (e.g., "graph traversal" for an array problem) can be used, **say NO immediately** and give a very brief reason.
        2️⃣ **Correct Approach:** If the user asks if a valid approach can be used, **confirm YES** and encourage them to try it out.
        3️⃣ **User’s Own Approach:**
            - If correct: ✅ "Yes, that works! Try implementing it."
            - If incorrect: ❌ "No, that approach won't work because [brief reason]. Instead, try [correct approach]."
        4️⃣ **User Has No Idea:** If the user says they don’t know how to approach the problem, **immediately give a small hint** without revealing the full solution.
        5️⃣ **Stay on Topic:** Do NOT discuss anything outside the problem, and do NOT generate full code. Focus only on guiding the user toward solving the problem step by step.
        6️⃣ **Be Direct:** Avoid unnecessary questions like "What do you think the nodes/edges represent?" unless it is absolutely necessary.

        👉 Now, based on these rules, respond to this user query: "${userInput}"`;

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
