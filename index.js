const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Gemini API සැකසුම (ඔබේ API Key එක මෙතනට දාන්න)
const genAI = new GoogleGenerativeAI("AIzaSyA52JswA_rgcfVMgnCjTAHQz7NiiKhki68");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 2. WhatsApp Client එක සැකසීම
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Codespaces වලදී මෙය වැදගත් වේ
            '--disable-gpu'
        ],
    }
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
