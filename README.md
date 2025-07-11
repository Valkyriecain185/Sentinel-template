# Sentinel Discord Bot Template

A clean, modern Discord bot template built with Discord.js v14.

## 📁 Project Structure

```
discord-bot-template/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── index.js                      # Main entry point
├── package.json                  # Dependencies and scripts
├── README.md                     # This file
└── src/
    ├── commands/                 # Slash commands
    │   ├── info.js              # Bot information command
    │   └── ping.js              # Ping command
    ├── events/                   # Discord events
    │   ├── interactionCreate.js # Handle slash commands
    │   └── ready.js             # Bot ready event
    ├── handlers/                 # Event and command handlers
    │   ├── commandHandler.js    # Load commands
    │   └── eventHandler.js      # Load events
    └── utils/                    # Utility functions
        └── deployCommands.js    # Deploy slash commands
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env` and fill in your bot credentials
   - Get your bot token from [Discord Developer Portal](https://discord.com/developers/applications)

3. **Deploy commands:**
   ```bash
   node src/utils/deployCommands.js
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Update the `.env` file with your bot's credentials:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

## 📝 Adding Commands

1. Create a new file in `src/commands/`
2. Export an object with `data` and `execute` properties
3. Run the deploy script to register the command
4. Restart your bot

Example command structure:
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('example')
        .setDescription('An example command'),
    
    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
};
```

## 🎯 Features

- **Clean Structure**: Organized file structure with handlers
- **Error Handling**: Comprehensive error handling for commands
- **Auto-Loading**: Automatic command and event loading
- **Modern Discord.js**: Built with Discord.js v14
- **Environment Variables**: Secure credential management
- **Example Commands**: Ping and info commands included

## 📜 License

This project is licensed under the MIT License.