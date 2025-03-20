document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");

    if (backbtn) {
        backbtn.addEventListener("click", function () {
            window.location.href = "popup.html"; // ✅ Redirect safely
        });
    }

    const sendMessage = async () => {
        const userInput = document.getElementById('user-input').value.trim();
        if (!userInput) return;

        const chatBox = document.getElementById('chat-box');

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = "message user";
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);

        document.getElementById('user-input').value = '';

        async function getActiveTabUrl() {
            return new Promise((resolve) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    resolve(tabs[0].url); // ✅ Return active tab's URL
                });
            });
        }

        let prob = await getActiveTabUrl();
        alert(prob); // Debugging

        // Retrieve the stored problem statement
        chrome.storage.local.get([prob], async (data) => { // ✅ Correct key usage
            if (!data[prob]) { // ✅ Correct way to check stored data
                alert("No problem statement found in storage.");
                return;
            }

            let problemInput = data[prob]; // ✅ Correct variable assignment

            try {
                const response = await fetch(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                role: 'user',
                                parts: [{
                                    text: `The user is solving the following problem:\n\n${problemInput}\n\nUser's understanding of the problem:\n\n${userInput}\n\nTask:\n- Analyze the user's input:\n  - If the statement is **meaningless**, ignore it and do **not** respond.\n  - If the user's understanding is **irrelevant** to the problem, tell them to "reread the problem statement" and stop there—no explanation.\n- If the understanding is relevant:\n  - Pinpoint any **mistakes or gaps** in their reasoning.\n  - Give a **short, precise** correction.\n  - Suggest **concise** steps to improve.\n\nImportant Guidelines:\n- Limit responses to **3-4 bullet points** max—keep it brief.\n- Focus on **actionable feedback**, no long explanations.\n- **Never** give the full solution.\n- Ignore **unrelated or off-topic** questions.\n- Speak **directly** to the user (e.g., "You missed this...").\n- Push the user to **think critically** and figure it out themselves.\nRespond like you are directly interacting with the user (e.g., "Your explanation...", "Your response...")`
                                }]
                            }]
                        })
                    }
                );

                const jsonResponse = await response.json();

                if (jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const botMessage = document.createElement('div');
                    botMessage.className = "message bot";
                    const markdownText = jsonResponse.candidates[0].content.parts[0].text;
                    botMessage.innerHTML = marked.parse(markdownText); // ✅ Convert Markdown to HTML
                    chatBox.appendChild(botMessage);
                } else {
                    console.error("Invalid response format:", jsonResponse);
                }
            } catch (error) {
                console.error("Error fetching response:", error);
            }
        });
    };

    // Click event for send button
    document.getElementById('send-btn').addEventListener('click', sendMessage);

    // Enter key event for input field
    document.getElementById('user-input').addEventListener('keypress', function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents form submission or new line
            sendMessage();
        }
    });
});