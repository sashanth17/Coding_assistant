document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");

    backbtn.addEventListener("click", function () {
        window.location.href = "popup.html";  // ✅ Redirects safely
    });
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

    let prompt = `
    You are a coding assistant that provides the approach to solving a problem.
    
    📌 **Rules:**
    1️⃣ If the user **greets** (e.g., "hey"), respond casually, like:
       → "Hey! Ready to crack this problem? Let's go!"
    
    2️⃣ If the user **asks for the approach**, first ask:
       → "How would you approach this problem?"
    
    3️⃣ **If the user provides an approach:**
       - ✅ If **correct**, say: "Nice! That's the right way. Try implementing it!"
       - ❌ If **incorrect**, gently correct them and **then provide the proper approach**.
    
    4️⃣ **If the user doesn’t know the approach**, directly provide a **clear and concise approach** with a small hint.
    
    5️⃣ **Keep responses short and engaging!**

    **If the user does not know the approach or problem give hime the detailed solution!**
    
    **User Input:** "${userInput}"
    `;

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
