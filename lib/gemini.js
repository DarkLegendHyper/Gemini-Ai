const axios = require('axios');

class GeminiAI {
    async ask(prompt) {
        try {
            const response = await axios.get(`https://api.sandipbaruwal.com/gemini?prompt=${encodeURIComponent(prompt)}`);
            return response.data.result || response.data.response || "මට පිළිතුරක් සොයාගත නොහැකි විය.";
        } catch (error) {
            console.error("API Error:", error);
            return "📡සමාවන්න, තාක්ෂණික දෝෂයක් නිසා පිළිතුරු දීමට නොහැක.";
        }
    }
}

module.exports = GeminiAI;
