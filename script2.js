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

        // Retrieve the stored problem statement and proceed only after it's retrieved
        chrome.storage.local.get("problemStatement", async (data) => {
            if (!data.problemStatement) {
                alert("No problem statement found in storage.");
                return;
            }

            let problemInput = data.problemStatement; // Store in variable
            alert("Problem Statement Retrieved Successfully:\n" + problemInput); // Alert message

            try {
                // Fetch response from Gemini API
                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{
                                text: `The user is solving the following problem:\n\n${problemInput}\n\nUser's understanding of the problem:\n\n${userInput}\n\nTask:\n- Analyze the user's input:\n  - If the statement is **meaningless**, ignore it and do **not** respond.\n  - If the user's understanding is **irrelevant** to the problem, tell them to "reread the problem statement" and stop there—no explanation.\n- If the understanding is relevant:\n  - Pinpoint any **mistakes or gaps** in their reasoning.\n  - Give a **short, precise** correction.\n  - Suggest **concise** steps to improve.\n\nImportant Guidelines:\n- Limit responses to **3-4 bullet points** max—keep it brief.\n- Focus on **actionable feedback**, no long explanations.\n- **Never** give the full solution.\n- Ignore **unrelated or off-topic** questions.\n- Speak **directly** to the user (e.g., "You missed this...").\n- Push the user to **think critically** and figure it out themselves.\nrespond like you are directly interacting to the user (eg:-your explanation,your response  like this)`  
                            }]
                        }]
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

