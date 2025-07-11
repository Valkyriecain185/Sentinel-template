const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Debug environment variables
console.log('🔍 Checking environment variables...');
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '✅ Set' : '❌ Missing');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GUILD_ID:', process.env.GUILD_ID ? '✅ Set' : '❌ Missing');

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
    console.error('❌ Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');

console.log(`📁 Looking for commands in: ${commandsPath}`);

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(`📄 Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(`📥 Loading command: ${file}`);
        
        try {
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log(`✅ Successfully loaded: ${command.data.name}`);
            } else {
                console.log(`⚠️  Command at ${filePath} is missing required "data" or "execute" property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
        }
    }
} else {
    console.error(`❌ Commands directory does not exist: ${commandsPath}`);
    process.exit(1);
}

console.log(`📦 Total commands to deploy: ${commands.length}`);

if (commands.length === 0) {
    console.error('❌ No commands to deploy!');
    process.exit(1);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
        
        // Choose deployment method
        let route;
        if (process.env.GUILD_ID) {
            console.log('📍 Deploying to specific guild (faster for testing)');
            route = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID);
        } else {
            console.log('🌍 Deploying globally (takes up to 1 hour)');
            route = Routes.applicationCommands(process.env.CLIENT_ID);
        }
        
        const data = await rest.put(route, { body: commands });
        
        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
        
        if (process.env.GUILD_ID) {
            console.log('💡 Commands should appear immediately in your test server!');
        } else {
            console.log('⏰ Global commands may take up to 1 hour to appear.');
        }
        
    } catch (error) {
        console.error('❌ Error deploying commands:');
        
        if (error.code === 50001) {
            console.error('   Missing Access - Check if your bot is in the server and has proper permissions');
        } else if (error.code === 50035) {
            console.error('   Invalid Form Body - Check your command data structure');
        } else if (error.rawError) {
            console.error('   Raw Error:', error.rawError);
        } else {
            console.error('   Error:', error.message);
        }
        
        process.exit(1);
    }
})();