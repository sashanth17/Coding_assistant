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

    // Function to get the API Key (if missing, prompt the user)
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

    // Function to send user input and retrieve stored code
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

        let codeKey = tabUrl + "_Code"; // ✅ Append "_Code" for retrieval key

        // 🔥 Retrieve stored code from local storage
        chrome.storage.local.get([codeKey], async (data) => {
            if (!data[codeKey]) {
                const errorMessage = document.createElement("div");
                errorMessage.className = "message bot";
                errorMessage.textContent = "⚠️ Error: No stored code found for this page.";
                chatBox.appendChild(errorMessage);
                return;
            }

            let storedCode = data[codeKey];

            let apiKey = await getAPIKey(); // ✅ Retrieve API Key from storage
            if (!apiKey) {
                alert("⚠️ API Key is required to proceed.");
                return;
            }

            // 🔥 Construct AI Prompt
            let prompt = `
You are an AI coding mentor that **helps users refine their code**. Keep responses **short, friendly, and helpful**. **Follow these rules strictly**:

🔹 **If there are syntax errors**:  
   - Mention them clearly and **suggest a fix**, but do **not rewrite the code**.  
   - Example: **"You forgot a semicolon at line X."**  

🔹 **If there are logical errors**:  
   - Explain **why** the logic is incorrect and **suggest a fix**.  
   - Example: **"Your loop condition causes an infinite loop. Try using <= instead of <."**  

❌ **Do NOT provide the entire corrected code**.  

🤔 **If the user is struggling with implementation**:  
   - Give a **small hint** on how to proceed, but **do NOT write the solution**.  
   - Example: **"Think about using a hash map to optimize lookups."**  

👉 **Stored Code:** ${storedCode}  
👉 **User's Code:** "${userInput}"
`;

            try {
                // 🔥 Fetch response from Gemini API
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