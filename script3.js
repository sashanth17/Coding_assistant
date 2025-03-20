document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");
    const userInputField = document.getElementById("user-input");

    if (backbtn) {
        backbtn.addEventListener("click", function () {
            window.location.href = "popup.html"; // ✅ Redirect safely
        });
    }

    // Function to get the API Key (if not found, prompt the user)
    async function getAPIKey() {
        return new Promise((resolve) => {
            chrome.storage.local.get(["userAPIKey"], function (result) {
                if (result["userAPIKey"]) {
                    resolve(result["userAPIKey"]);
                } else {
                    let apiKey = prompt("Enter your API Key:");
                    if (apiKey) {
                        chrome.storage.local.set({ "userAPIKey": apiKey }, function () {
                            console.log("API Key stored successfully.");
                        });
                        resolve(apiKey);
                    } else {
                        console.log("No API Key entered.");
                        resolve(null);
                    }
                }
            });
        });
    }

    // Function to get the active tab's URL
    async function getActiveTabUrl() {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    resolve(tabs[0].url); // ✅ Return active tab's URL
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Function to send user input and retrieve problem statement
    const sendMessage = async () => {
        const userInput = userInputField.value.trim();
        if (!userInput) return;

        // Display user message
        const userMessage = document.createElement("div");
        userMessage.className = "message user";
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);
        userInputField.value = "";

        let tabUrl = await getActiveTabUrl();
        if (!tabUrl) {
            alert("❌ Error: Unable to get the active tab URL.");
            return;
        }

        // 🔥 Retrieve problem statement from local storage
        chrome.storage.local.get([tabUrl], async (data) => {
            if (!data[tabUrl]) {
                const errorMessage = document.createElement("div");
                errorMessage.className = "message bot";
                errorMessage.textContent = "⚠️ Error: No problem statement found for this page.";
                chatBox.appendChild(errorMessage);
                return;
            }

            let problemStatement = data[tabUrl];

            let apiKey = await getAPIKey(); // ✅ Retrieve API Key from storage
            if (!apiKey) {
                alert("⚠️ API Key is required to proceed.");
                return;
            }

            // 🔥 Construct AI Prompt
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
                // 🔥 Step 4: Fetch response from Gemini API using retrieved API Key
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    // Enter key event for input field
    if (userInputField) {
        userInputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents form submission or new line
                sendMessage();
            }
        });
    }
});