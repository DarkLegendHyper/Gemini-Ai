const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const GeminiAI = require('./lib/gemini');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('your api key add');
    process.exit(1);
}
const ai = new GeminiAI(API_KEY);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/nix/store/chromium/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR CODE:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot START');
});

client.on('message', async (msg) => {
    if (msg.from === 'status@broadcast') return;
    if (msg.from.includes('@g.us')) return;

    try {
        console.log(`MESSAGE: ${msg.body}`);
        
        const aiResponse = await ai.ask(msg.body);
        await msg.reply(aiResponse);
        
    } catch (error) {
        console.error("Error:", error);
    }
});

client.initialize();;

