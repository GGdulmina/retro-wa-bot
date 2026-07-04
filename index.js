const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const { exec } = require('child_process');

// Configuration
const AUTHORIZED_NUMBER = '1234567890@c.us'; // REPLACE WITH YOUR WHATSAPP NUMBER (with @c.us suffix)
const NMAP_TARGET = '192.168.1.1'; // Target for nmap scan
const SIMILARITY_THRESHOLD = 0.8; // 80% similarity threshold for typo forgiveness

const client = new Client({
    authStrategy: new LocalAuth()
});

// Load knowledge base from data.json
let knowledgeBase = [];
try {
    const data = fs.readFileSync('./data.json', 'utf8');
    knowledgeBase = JSON.parse(data);
    console.log(`✅ Loaded ${knowledgeBase.length} knowledge entries from data.json`);
} catch (error) {
    console.error('❌ Error loading data.json:', error.message);
    process.exit(1);
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - The Levenshtein distance
 */
function levenshteinDistance(a, b) {
    const matrix = [];

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate similarity percentage between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - Similarity percentage (0-1)
 */
function similarity(a, b) {
    const maxLength = Math.max(a.length, b.length);
    if (maxLength === 0) return 1.0;
    return 1 - (levenshteinDistance(a, b) / maxLength);
}

/**
 * Get response from knowledge base with typo forgiveness
 * @param {string} input - User's input message
 * @returns {string} - Appropriate response
 */
function getResponse(input) {
    const inputLower = input.toLowerCase().trim();

    // First, check for exact matches
    for (const item of knowledgeBase) {
        if (item.keyword.toLowerCase() === inputLower) {
            return item.response;
        }
    }

    // If no exact match, find the best fuzzy match
    let bestMatch = null;
    let highestSimilarity = 0;

    for (const item of knowledgeBase) {
        const similarityScore = similarity(inputLower, item.keyword.toLowerCase());
        if (similarityScore > highestSimilarity && similarityScore >= SIMILARITY_THRESHOLD) {
            highestSimilarity = similarityScore;
            bestMatch = item;
        }
    }

    if (bestMatch) {
        return bestMatch.response;
    }

    // Default response if no match found
    return "I'm still learning and didn't quite catch that. Try typing 'help'!";
}

// Generate a PNG image instead of a terminal printout
client.on('qr', (qr) => {
    qrcode.toFile('./login-qr.png', qr, {
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (err) {
        if (err) throw err;
        console.log('✅ QR Code saved! Open the login-qr.png file in this folder to scan it.');
    });
});

client.on('ready', () => {
    console.log('🤖 Agent is online and ready!');
});

// Listen for incoming messages
client.on('message', async (msg) => {
    // Ignore status updates and broadcasts immediately
    if (msg.from === 'status@broadcast') {
        return;
    }
    console.log(`📩 Received message: ${msg.body} from ${msg.from}`);

    // Handle !scan command with authorization check
    if (msg.body.startsWith('!scan')) {
        // Check if sender is authorized
        if (msg.from !== AUTHORIZED_NUMBER) {
            await msg.reply('❌ Access denied. You are not authorized to use the scan command.');
            return;
        }
        
        // Ignore Group Chats
        if (msg.from.endsWith('@g.us')) return;

        // Ignore messages from yourself
        if (msg.fromMe) return;

        // Ignore specific system messages or empty messages
        if (!msg.body) return;

        // Send scanning message
        await msg.reply('🔍 Scanning network... Please wait...');

        // Execute nmap command
        exec(`nmap -sS -O -sV ${NMAP_TARGET}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Scan error: ${error}`);
                msg.reply(`❌ Scan failed: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`❌ Scan stderr: ${stderr}`);
                msg.reply(`❌ Scan encountered issues: ${stderr}`);
                return;
            }

            // Send the scan results
            msg.reply(`🔍 Scan results for ${NMAP_TARGET}:\n\n${stdout}`);
        });
        return; // Exit early to prevent also sending a knowledge base response
    }

    // Handle regular knowledge base queries
    const response = getResponse(msg.body);
    await msg.reply(response);
});

// Boot up the client
client.initialize();

console.log('🚀 WhatsApp bot starting...');
console.log(`🔐 Authorized number for scan command: ${AUTHORIZED_NUMBER}`);
console.log(`🎯 Nmap target: ${NMAP_TARGET}`);
console.log(`📊 Similarity threshold for typo forgiveness: ${SIMILARITY_THRESHOLD * 100}%`);