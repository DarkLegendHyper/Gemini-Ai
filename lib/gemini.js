const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini සම්බන්ධ කරන Library එක
class GeminiAI {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "ඔබේ නම Gemini. ඔබ WhatsApp හරහා සහාය දෙන කාරුණික AI සහායකයෙකි."
        });
    }

    async ask(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "සමාවන්න, මට එම ප්‍රශ්නයට පිළිතුරු දීමට අපහසුයි.";
        }
    }
}

module.exports = GeminiAI;
