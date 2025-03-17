document.addEventListener("DOMContentLoaded", async () => {
    const timerElement = document.getElementById("timer");
    const difficultySelect = document.getElementById("difficulty");
    const hintButton = document.getElementById("getHint");
    const explanationButton = document.getElementById("getExplanation");
    const hintDisplay = document.getElementById("hint");
    const explanationDisplay = document.getElementById("explanation");

    // Get time spent from storage
    chrome.storage.local.get(["timeSpent"], (data) => {
        timerElement.textContent = `Time Spent: ${data.timeSpent || 0} mins`;
    });

    const API_KEY = "AIzaSyCgwnIuHmWlUoip9-dmiCaEEMXsTFux3RI"; // Replace with your actual API key

    // Function to fetch AI response
    async function fetchAIResponse(promptText, displayElement) {
        displayElement.textContent = "Fetching response...";

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }]
                    }),
                }
            );

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                displayElement.textContent = data.candidates[0].content.parts[0].text.trim();
            } else {
                displayElement.textContent = "No response available.";
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            displayElement.textContent = "Error fetching response.";
        }
    }

    // Fetch AI-generated hint
    hintButton.addEventListener("click", () => {
        const difficulty = difficultySelect.value;
        fetchAIResponse(`Give a helpful hint for a ${difficulty} coding problem.`, hintDisplay);
    });

    // Fetch AI-generated detailed explanation
    explanationButton.addEventListener("click", () => {
        const difficulty = difficultySelect.value;
        fetchAIResponse(`Provide a detailed explanation for a ${difficulty} coding problem.`, explanationDisplay);
    });
});
