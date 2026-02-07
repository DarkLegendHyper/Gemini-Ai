const axios = require('axios');

class GeminiAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async ask(prompt) {
        try {
            // FIX: You must use the actual API URL and attach your key and prompt as parameters
            const url = `https://api.sandipbaruwal.com/gemini?prompt=${encodeURIComponent(prompt)}&api_key=${this.apiKey}`;
            
            const response = await axios.get(url);
            
            // Check for the response in different possible formats
            return response.data.result || response.data.response || "මට පිළිතුරක් සොයාගත නොහැකි විය.";
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            return "📡 සමාවන්න, තාක්ෂණික දෝෂයක් නිසා පිළිතුරු දීමට නොහැක.";
        }
    }
}

module.exports = GeminiAI;
