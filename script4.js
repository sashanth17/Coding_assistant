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
        let problemStatement = data[tabUrl] || "No specific problem statement found."; // ✅ Default message if not found

        // 🔥 Step 3: Build the AI prompt
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
        
        👉 **Problem Statement:** ${problemStatement}  
        👉 **User Input:** "${userInput}"
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