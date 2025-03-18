
setInterval(() => {
    timeSpent += 1;
    chrome.storage.local.set({ timeSpent });
<<<<<<< HEAD
}, 60000); // Increments every 1 minute
fy
=======
}, 60000);

// Reset timer when tab is changed
chrome.tabs.onActivated.addListener(() => {
    timeSpent = 0;
    chrome.storage.local.set({ timeSpent });
});

// Function to get the selected text
function getSelectedText() {
    const selectedText = window.getSelection().toString().trim();
    return selectedText || "No code selected!";
}

// Function to handle the AI response
async function getGeminiResponse(prompt) {
    const API_KEY = "AIzaSyCgwnIuHmWlUoip9-dmiCaEEMXsTFux3RI"; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data); // Debugging log

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    } catch (error) {
        console.error("Error fetching response:", error);
        return "An error occurred.";
    }
}

// Event listener for "Get AI Hint"
document.getElementById("getHint").addEventListener("click", async function () {
    const selectedCode = getSelectedText();
    
    if (selectedCode === "No code selected!") {
        alert("Please select some code before requesting a hint.");
        return;
    }

    const prompt = `Give me a coding hint for this code:\n\n${selectedCode}`;
    
    document.getElementById("hint").textContent = "Fetching hint...";

    const hint = await getGeminiResponse(prompt);
    document.getElementById("hint").textContent = hint;
});

// Event listener for "Get Detailed Explanation"
document.getElementById("getExplanation").addEventListener("click", async function () {
    const selectedCode = getSelectedText();

    if (selectedCode === "No code selected!") {
        alert("Please select some code before requesting an explanation.");
        return;
    }

    const prompt = `Explain this code in detail and suggest improvements:\n\n${selectedCode}`;

    document.getElementById("explanation").textContent = "Fetching explanation...";

    const explanation = await getGeminiResponse(prompt);
    document.getElementById("explanation").textContent = explanation;
});

// Timer function to track time spent
let timeSpent = 0;
setInterval(() => {
    timeSpent++;
    document.getElementById("timer").textContent = `Time Spent: ${timeSpent} mins`;
}, 60000); // Updates every 1 minute
>>>>>>> 0b40bc40857d3633d79be29e81ff345c9c7c10c4
