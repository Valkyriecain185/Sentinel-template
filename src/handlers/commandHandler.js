const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    client.commands = new Collection();
    
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.log('📁 Commands directory not found, creating it...');
        fs.mkdirSync(commandsPath, { recursive: true });
        console.log('💡 No commands to load. Run deployment script first!');
        return;
    }
    
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    if (commandFiles.length === 0) {
        console.log('📂 No command files found in commands directory');
        console.log('💡 Commands will still work if deployed via deployment script');
        return;
    }
    
    console.log(`📂 Loading ${commandFiles.length} command files...`);
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        
        try {
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Loaded command: ${command.data.name}`);
            } else {
                console.log(`⚠️  Command at ${filePath} is missing required "data" or "execute" property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
        }
    }
    
    console.log(`📋 Total commands loaded: ${client.commands.size}`);
}

module.exports = { loadCommands };