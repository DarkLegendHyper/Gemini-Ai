const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const GeminiAI = require('./lib/gemini');

// Ensure you have a .env file or export this variable
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is missing in your environment variables.');
    process.exit(1);
}

const ai = new GeminiAI(API_KEY);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Removed the hardcoded Nix path unless you are specifically on NixOS
        // If on Windows/Mac/Linux, Puppeteer usually finds Chromium automatically
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot is Ready and Online!');
});

client.on('message', async (msg) => {
    // Ignore status updates and group messages
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    try {
        console.log(`Received message from ${msg.from}: ${msg.body}`);
        
        // Ensure the AI tool is working correctly
        const aiResponse = await ai.ask(msg.body);
        
        if (aiResponse) {
            await msg.reply(aiResponse);
        }
        
    } catch (error) {
        console.error("AI Processing Error:", error);
        await msg.reply("Sorry, I'm having trouble thinking right now.");
    }
});

client.initialize();

