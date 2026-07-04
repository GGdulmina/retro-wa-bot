# Local WhatsApp AI Agent

A rule-based WhatsApp AI agent built with Node.js and whatsapp-web.js that runs completely locally without third-party APIs.

## Features

1. **JSON Dictionaries for Knowledge** - Responses are stored in `data.json` as keyword-response pairs
2. **Typo Forgiveness** - Uses Levenshtein distance algorithm to understand messages with typos (80% similarity threshold)
3. **Local System Integration** - Authorized users can run `!scan` command to perform network scans using nmap

## Setup

1. Install Node.js (if not already installed)
2. Clone or copy this repository
3. Run `npm install` to install dependencies
4. Edit `index.js` and replace `AUTHORIZED_NUMBER` with your WhatsApp number (including `@c.us` suffix)
5. Optionally edit `data.json` to customize the knowledge base
6. Run `node index.js` to start the bot
7. Scan the QR code that appears in `login-qr.png` with your WhatsApp

## How It Works

### Knowledge Base
The bot loads responses from `data.json` which contains objects with:
- `keyword`: The trigger word/phrase
- `response`: The bot's response when the keyword is matched

### Typo Forgiveness
When a message doesn't exactly match any keyword, the bot calculates the similarity between the input and each keyword using the Levenshtein distance algorithm. If the similarity is 80% or higher, it uses the response from the closest match.

Example:
- User sends: "helo" (typo for "hello")
- Similarity with "hello": 80% match
- Bot responds with the "hello" response

### Network Scan Command
Authorized users can send `!scan` to initiate a network scan:
- Only the number specified in `AUTHORIZED_NUMBER` in `index.js` can use this command
- Runs: `nmap -sS -O -sV 192.168.1.1`
- Results are sent back as a WhatsApp message
- Requires nmap to be installed on the system

## File Structure

- `index.js` - Main bot logic
- `data.json` - Knowledge base (keyword-response pairs)
- `package.json` - Node.js dependencies
- `login-qr.png` - QR code for WhatsApp login (generated on first run)
- `node_modules/` - Node.js dependencies
- `.wwebjs_auth/` - WhatsApp Web authentication data
- `.wwebjs_cache/` - WhatsApp Web cache data

## Dependencies

- whatsapp-web.js
- qrcode

## Customization

### Adding New Responses
Edit `data.json` to add new objects:
```json
{
  "keyword": "your keyword here",
  "response": "Your response here"
}
```

### Changing Authorization
Edit the `AUTHORIZED_NUMBER` constant in `index.js`:
```javascript
const AUTHORIZED_NUMBER = 'your-number@c.us'; // Get this from WhatsApp Web
```

### Changing Nmap Target
Edit the `NMAP_TARGET` constant in `index.js`:
```javascript
const NMAP_TARGET = '192.168.1.1'; // Change to your target network/IP
```

### Adjusting Typo Tolerance
Edit the `SIMILARITY_THRESHOLD` constant in `index.js` (0.0 to 1.0):
```javascript
const SIMILARITY_THRESHOLD = 0.8; // 80% match required
```

## Notes

- The first time you run the bot, it will generate a QR code in `login-qr.png`
- Scan this code with WhatsApp on your phone to link the device
- Keep the `.wwebjs_auth` and `.wwebjs_cache` folders to stay logged in
- Make sure nmap is installed and accessible in your system PATH for the scan feature to work
- For best results with typo forgiveness, use distinct keywords that aren't too similar to each other

## Troubleshooting

- If you see QR code errors, delete the `.wwebjs_auth` and `.wwebjs_cache` folders and restart
- If nmap is not found, install it from https://nmap.org/download.html
- Make sure your WhatsApp number is correctly formatted with `@c.us` suffix