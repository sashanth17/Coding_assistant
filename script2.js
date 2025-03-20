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
                                    text: `The user is solving this coding problem:\n
                                    \n${problemInput}\n\nUser's understanding of the problem:\n\n${userInput}\n\n
                                    Task:\n- Review the user's input:\n
                                    
                                    If it’s vague or meaningless, skip it and don’t respond.\n
                                    If it’s unrelated to the problem, say "Reread the problem statement" and stop.\n
                                    If it’s relevant:\n - Spot any errors or gaps in their logic.\n
                                    Offer a short, clear correction.\n - Recommend brief, practical steps to improve.\n\n Guidelines:\n
                                    Keep responses to 3-4 bullet points max—short and sweet.\n
                                    Provide actionable tips, no lengthy explanations.\n
                                    Don’t solve the problem fully—let the user figure it out.\n
                                    If asked for the full solution, say "I can’t give the full answer—try breaking it down yourself!" and stop.\n
                                    Ignore off-topic comments.\n
                                    Talk directly to the user (e.g., "You’re missing...", "Try this...").\n
                                    Encourage critical thinking to boost problem-solving skills.\n Respond as if chatting with the user (e.g., "Your take...", "You got this...").`
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