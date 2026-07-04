# retro-wa-bot

![GitHub repo size](https://img.shields.io/github/repo-size/GGdulmina/retro-wa-bot)
![GitHub last commit](https://img.shields.io/github/last-commit/GGdulmina/retro-wa-bot)
![GitHub](https://img.shields.io/github/license/GGdulmina/retro-wa-bot)
![GitHub issues](https://img.shields.io/github/issues/GGdulmina/retro-wa-bot)
![GitHub pull requests](https://img.shields.io/github/issues-pr/GGdulmina/retro-wa-bot)

A lightweight, modular WhatsApp automation bot built with Node.js and [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). Designed for local task management, featuring keyword-based auto-responses, network scanning capabilities, and efficient session handling.

## Features

- **Keyword-based Responses**: Customizable auto-replies based on keywords (see `data.json`)
- **Network Scanning**: Authorized users can run network scans via `!scan` command
- **Session Persistence**: Uses `@whatsappsockets/web` to maintain login sessions
- **QR Code Login**: Generates QR code for easy WhatsApp Web pairing
- **Lightweight**: Minimal dependencies for easy deployment
- **Modular Design**: Easy to extend with new commands and features

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/retro-wa-bot.git
   cd retro-wa-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have Node.js >= 14.x installed.

## Usage

1. Start the bot:
   ```bash
   node .   # or whichever entry point (check package.json if exists)
   ```

2. On first run, a QR code will be generated and saved as `login-qr.png`. Scan this QR code with WhatsApp on your phone to link the device.

3. Once connected, the bot will respond to messages based on the keywords defined in `data.json`.

4. Authorized users can use the `!scan` command to initiate network scanning.

## Configuration

### Custom Responses
Edit `data.json` to add or modify keyword-response pairs. Each entry consists of:
- `keyword`: The trigger word or phrase (case-insensitive)
- `response`: The message to send when the keyword is detected

Example format:
```json
[
  {
    "keyword": "hello",
    "response": "Hi there! How can I assist you today?"
  },
  {
    "keyword": "scan",
    "response": "Scan initiated! Checking network..."
  }
]
```

### Authorized Users
The bot likely has a mechanism to restrict certain commands (like `!scan`) to specific users. Check the source code for implementation details.

## Project Structure

- `data.json` - Stores keyword-response pairs for the bot's auto-replies
- `login-qr.png` - Generated QR code for WhatsApp login (generated on first run)
- `.wwebjs_auth/` - Directory storing WhatsApp Web session data
- `.wwebjs_cache/` - Cache files for the WhatsApp Web client
- `LICENSE` - MIT license file

## Requirements

- Node.js >= 14.x
- npm or yarn
- WhatsApp account on your phone
- Google Chrome or Chromium (for headless browser operation)

## How It Works

The bot uses the `whatsapp-web.js` library to create a WhatsApp Web client. When a message is received, it checks the message content against the keywords in `data.json`. If a match is found, it sends the corresponding response. Special commands like `!scan` may trigger additional functionality.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - The WhatsApp client library used
- Open source contributors

---

*Note: This bot is intended for personal and educational use. Please respect WhatsApp's Terms of Service and use responsibly.*