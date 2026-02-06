const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini API Configuration
// ඔබේ API Key එක පහත ස්ථානයට ඇතුළත් කරන්න
const genAI = new GoogleGenerativeAI("ඔබේ_API_KEY_එක_මෙතනට_දමන්න");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a helpful assistant named Gemini. Answer clearly and concisely."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ],
    }
});

client.on('qr', (qr) => {
    console.log('Scan the QR code below:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready and running!');
});

client.on('message', async (msg) => {
    // ගෲප් පණිවිඩ නොසලකා හැරීමට
    if (msg.from.includes('@g.us')) return;

    try {
        // Gemini වෙතින් පිළිතුර ලබා ගැනීම
        const result = await model.generateContent(msg.body);
        const response = await result.response;
        const text = response.text();

        // පිළිතුර යැවීම
        await msg.reply(text);
    } catch (error) {
        console.error("Error:", error);
    }
});

client.initialize();
