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
            let problemStatement = data[tabUrl] || "⚠️ No specific problem statement found."; // ✅ Default message if missing

            let apiKey = await getAPIKey(); // ✅ Retrieve API Key from storage
            if (!apiKey) {
                alert("⚠️ API Key is required to proceed.");
                return;
            }

            // 🔥 Construct AI Prompt
            let prompt = `
You are a coding assistant focused on improving the user’s logic-building skills by guiding them through problems without revealing the full approach.

📌 **Rules:**
1️⃣ If the user greets (e.g., "hey", "hi"), respond casually:
   → "Hey! Excited to solve this? Let’s dive in!"

2️⃣ If the user asks for the approach without explaining:
   → Ask: "How would you tackle this? Share your thoughts!"

3️⃣ **Analyze User Input:**
   ❌ If unrelated to the problem (e.g., random text): → Say: "That’s off-topic—let’s focus on the problem!"
   ✅ If an explanation or approach is provided:
      - Check for errors or weak logic (e.g., missing edge cases, inefficient steps).
      - Point out one specific mistake gently (e.g., "You’re on track, but this might fail for negatives.").
      - Suggest one concise improvement (e.g., "Think about adding a check here—how would that help?").

4️⃣ **If the user doesn’t know the approach:**
   → Give a small hint (e.g., "Consider breaking it into smaller parts—what’s the first step?").

5️⃣ **If the user asks for the full solution or approach:**
   → Say: "I won’t spill the whole plan—try piecing it together, and I’ll nudge you along!"

6️⃣ **Feedback Focus:**
   - Keep it short (3-4 lines max), actionable, and friendly.
   - Avoid complete solutions—push the user to think critically.
   - Build their skills by linking feedback to future problems (e.g., "This trick will save you next time!").

👉 **Problem Statement:** ${problemStatement}
👉 **User Input:** "${userInput}"
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