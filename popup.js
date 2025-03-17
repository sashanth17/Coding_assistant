document.addEventListener("DOMContentLoaded", async () => {
    const timerElement = document.getElementById("timer");
    const difficultySelect = document.getElementById("difficulty");
    const hintButton = document.getElementById("getHint");
    const hintDisplay = document.getElementById("hint");

    // Get time spent from storage
    chrome.storage.local.get(["timeSpent"], (data) => {
        timerElement.textContent = `Time Spent: ${data.timeSpent || 0} mins`;
    });

    // Fetch AI-generated hint
    hintButton.addEventListener("click", async () => {
        hintDisplay.textContent = "Fetching hint...";

        const difficulty = difficultySelect.value;
        const API_KEY = "AIzaSyCgwnIuHmWlUoip9-dmiCaEEMXsTFux3RI"; // Replace with your actual API key

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts: [{ text: `Give a helpful hint for a ${difficulty} coding problem.` }] }]
                    }),
                }
            );

            console.log("Response status:", response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Parsed Response:", data);
            // Extract hint from response
            const hint = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No hint available.";
            hintDisplay.textContent = hint;

        } catch (error) {
            console.error("Error fetching hint:", error);
            hintDisplay.textContent = "Error fetching hint.";
        }
    });
});