import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';
import GeminiAI from './lib/gemini.js'; // Note: You MUST add the .js extension here

// ... the rest of your code stays the same
// 1. Setup API Key
const API_KEY = "AIzaSyCalW-qDRTeEHS_xoiAynngYM9VZpCACNI"; 

if (!API_KEY) {
    console.error('❌ Error: API Key is missing!');
    process.exit(1);
}

// 2. Initialize the AI (Only do this ONCE)
const ai = new GeminiAI(API_KEY);

// 3. Setup WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // MUST be true
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote'
        ]
    }
});

// 4. QR Code Generation
client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

// 5. Bot Ready Message
client.on('ready', () => {
    console.log('✅ WhatsApp Bot is Ready and Online!');
});

// 6. Handling Messages
client.on('message', async (msg) => {
    // Ignore status updates and group messages
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    try {
        console.log(`📩 Message from ${msg.from}: ${msg.body}`);
        
        // Use the AI to get a response
        const aiResponse = await ai.ask(msg.body);
        
        if (aiResponse) {
            await msg.reply(aiResponse);
        }
        
    } catch (error) {
        console.error("AI Processing Error:", error);
        await msg.reply("Sorry, I'm having trouble thinking right now.");
    }
});

// 7. Start the Bot
client.initialize();
