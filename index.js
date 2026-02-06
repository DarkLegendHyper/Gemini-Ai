const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Gemini API සැකසුම (ඔබේ API Key එක මෙතනට දාන්න)
const genAI = new GoogleGenerativeAI("ඔබේ_API_KEY_එක_මෙතනට");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 2. WhatsApp Client එක සැකසීම
const client = new Client({
    authStrategy: new LocalAuth()
});

// QR Code එක පෙන්වීම
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR එක Scan කරන්න...');
});

client.on('ready', () => {
    console.log('WhatsApp Bot සූදානම්!');
});

// 3. පණිවිඩ ලැබුණු විට ක්‍රියාත්මක වන කොටස
client.on('message', async (msg) => {
    try {
        // Gemini හරහා පිළිතුරක් ලබා ගැනීම
        const result = await model.generateContent(msg.body);
        const response = await result.response;
        const text = response.text();

        // WhatsApp පණිවිඩය යැවීම
        msg.reply(text);
    } catch (error) {
        console.error("දෝෂයක් සිදු විය:", error);
    }
});

client.initialize();
