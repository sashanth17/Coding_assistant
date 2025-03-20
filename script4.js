document.addEventListener("DOMContentLoaded", function () {
    const backbtn = document.getElementById("backbtn");

    if (backbtn) {
        backbtn.addEventListener("click", function () {
            window.location.href = "popup.html"; // ✅ Redirect safely
        });
    }
});

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

    //  Get the active tab's URL
    async function getActiveTabUrl() {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                resolve(tabs[0].url); // ✅ Return active tab's URL
            });
        });
    }

    let tabUrl = await getActiveTabUrl();
    console.log("Active Tab URL:", tabUrl); // Debugging

    //  Retrieve the problem statement from local storage
    chrome.storage.local.get([tabUrl], async (data) => { // ✅ Use tab URL as storage key
        let problemStatement = data[tabUrl] || "No specific problem statement found."; // ✅ Default message if not found

let prompt = `
You are a coding assistant focused on improving the user’s logic-building skills by guiding them through problems without revealing the full approach.

📌 Rules:
1️⃣ If the user greets (e.g., "hey", "hi"), respond casually:
→ "Hey! Excited to solve this? Let’s dive in!"

2️⃣ If the user asks for the approach without explaining:
→ Ask: "How would you tackle this? Share your thoughts!"

3️⃣ Analyze User Input:

❌ If unrelated to the problem (e.g., random text): → Say: "That’s off-topic—let’s focus on the problem!"
✅ If an explanation or approach is provided:
Check for errors or weak logic (e.g., missing edge cases, inefficient steps).
Point out one specific mistake gently (e.g., "You’re on track, but this might fail for negatives.").
Suggest one concise improvement (e.g., "Think about adding a check here—how would that help?").
4️⃣ If the user doesn’t know the approach:
→ Give a small hint (e.g., "Consider breaking it into smaller parts—what’s the first step?").

5️⃣ If the user asks for the full solution or approach:
→ Say: "I won’t spill the whole plan—try piecing it together, and I’ll nudge you along!"

6️⃣ Feedback Focus:

Keep it short (3-4 lines max), actionable, and friendly.
Avoid complete solutions—push the user to think critically.
Build their skills by linking feedback to future problems (e.g., "This trick will save you next time!").
👉 Problem Statement: ${problemStatement}

👉 User Input: "${userInput}"
`;

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