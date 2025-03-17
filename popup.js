// Function to handle the AI response
async function getGeminiResponse(prompt) {
    const API_KEY = "AIzaSyCZ7UWdTdjRMbJh9lDMnnLFDfElbHx9jdw"; // Replace with your actual API key
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

        // Extract and return the response text
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    } catch (error) {
        console.error("Error fetching response:", error);
        return "An error occurred.";
    }
}

// Function to get AI hint based on difficulty level
document.getElementById("getHint").addEventListener("click", async function () {
    const difficulty = document.getElementById("difficulty").value;
    const prompt = `Give me a coding problem hint for a ${difficulty} level problem.`;
    
    document.getElementById("hint").textContent = "Fetching hint...";

    const hint = await getGeminiResponse(prompt);
    document.getElementById("hint").textContent = hint;
});

// Function to get a detailed explanation
document.getElementById("getExplanation").addEventListener("click", async function () {
    const difficulty = document.getElementById("difficulty").value;
    const prompt = `Provide a detailed explanation for solving a ${difficulty} level coding problem.`;

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
