document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");

    if (backbtn) {
        backbtn.addEventListener("click", function () {
            window.location.href = "popup.html"; // ✅ Redirect safely
        });
    }

    const sendMessage = async () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (!userInput) return;

        const chatBox = document.getElementById("chat-box");

        // Display user message
        const userMessage = document.createElement("div");
        userMessage.className = "message user";
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);

        document.getElementById("user-input").value = "";

        // 🔥 Step 1: Get the active tab's URL
        async function getActiveTabUrl() {
            return new Promise((resolve) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    resolve(tabs[0].url); // ✅ Return active tab's URL
                });
            });
        }

        let tabUrl = await getActiveTabUrl();
        console.log("Active Tab URL:", tabUrl); // Debugging

        // 🔥 Step 2: Retrieve the problem statement from local storage
        chrome.storage.local.get([tabUrl], async (data) => { // ✅ Use tab URL as storage key
            if (!data[tabUrl]) { // ✅ If no data found, show an error
                const errorMessage = document.createElement("div");
                errorMessage.className = "message bot";
                errorMessage.textContent = "⚠️ Error: No problem statement found for this page.";
                chatBox.appendChild(errorMessage);
                return;
            }

            let problemStatement = data[tabUrl]; // ✅ Retrieve the problem statement

            // 🔥 Step 3: Build the AI prompt
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
                // 🔥 Step 4: Fetch response from Gemini API
                const response = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClpB5e0SFFAYNk8F-ObbkyGP200bYjKRs",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ role: "user", parts: [{ text: prompt }] }]
                        })
                    }
                );

                const data = await response.json();

                if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const botMessage = document.createElement("div");
                    botMessage.className = "message bot";
                    const markdownText = data.candidates[0].content.parts[0].text;

                    // ✅ Ensure `marked` is loaded before using it
                    if (typeof marked !== "undefined") {
                        botMessage.innerHTML = marked.parse(markdownText);
                    } else {
                        console.error("marked.js is not loaded.");
                        botMessage.textContent = markdownText; // Fallback to plain text
                    }

                    chatBox.appendChild(botMessage);
                } else {
                    console.error("Invalid response format:", data);
                }
            } catch (error) {
                console.error("Error fetching response:", error);
            }
        });
    };

    // Click event for send button
    const sendButton = document.getElementById("send-btn");
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }

    // Enter key event for input field
    const userInputField = document.getElementById("user-input");
    if (userInputField) {
        userInputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents form submission or new line
                sendMessage();
            }
        });
    }
});