const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const GeminiAI = require('./lib/gemini');

// ඔබේ Gemini API Key එක මෙතනට දමන්න
const API_KEY = "ඔබේ_API_KEY_එක_මෙතනට";
const ai = new GeminiAI(API_KEY);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('පහත QR එක Scan කරන්න:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot සූදානම්!');
});

client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return; // ගෲප් මැසේජ් මඟ හරින්න

    console.log(`User: ${msg.body}`);
    
    // Library එක හරහා පිළිතුර ලබා ගැනීම
    const aiResponse = await ai.ask(msg.body);
    
    await msg.reply(aiResponse);
});

client.initialize();;
