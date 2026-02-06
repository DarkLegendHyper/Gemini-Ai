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
    // 1. WhatsApp Status මඟ හැරීමට මෙම පේළිය එක් කරන්න
    if (msg.from === 'status@broadcast') return;

    // 2. ගෲප් මැසේජ් මඟ හැරීමට (අවශ්‍ය නම් පමණක්)
    if (msg.from.includes('@g.us')) return;

    try {
        console.log(`ලැබුණු පණිවිඩය: ${msg.body}`);
        
        const aiResponse = await ai.ask(msg.body);
        await msg.reply(aiResponse);
        
    } catch (error) {
        console.error("Error:", error);
    }
});

client.initialize();;
