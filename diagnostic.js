const { REST, Routes } = require('discord.js');
require('dotenv').config();

console.log('🔍 Discord Bot Diagnostic Tool');
console.log('================================');

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? `✅ Set (${process.env.DISCORD_TOKEN.substring(0, 20)}...)` : '❌ Missing');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? `✅ Set (${process.env.CLIENT_ID})` : '❌ Missing');
console.log('GUILD_ID:', process.env.GUILD_ID ? `✅ Set (${process.env.GUILD_ID})` : '❌ Missing');

// Check if we can create REST client
console.log('\n2. Discord API Connection:');
if (!process.env.DISCORD_TOKEN) {
    console.log('❌ Cannot test connection - no token provided');
    process.exit(1);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

async function runDiagnostic() {
    try {
        // Test basic API connection
        console.log('🔄 Testing Discord API connection...');
        const user = await rest.get(Routes.user());
        console.log(`✅ Connected as: ${user.username}#${user.discriminator}`);
        
        // Check if bot is in the guild
        if (process.env.GUILD_ID) {
            console.log('\n3. Guild Access:');
            try {
                const guild = await rest.get(Routes.guild(process.env.GUILD_ID));
                console.log(`✅ Bot can access guild: ${guild.name}`);
                
                // Check existing commands
                console.log('\n4. Current Commands:');
                const existingCommands = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID));
                console.log(`📋 Found ${existingCommands.length} existing commands:`);
                existingCommands.forEach(cmd => {
                    console.log(`   - ${cmd.name}: ${cmd.description}`);
                });
                
            } catch (error) {
                console.log('❌ Cannot access guild:', error.message);
                console.log('💡 Make sure:');
                console.log('   - Bot is added to the server');
                console.log('   - Bot has "applications.commands" permission');
                console.log('   - Guild ID is correct');
            }
        }
        
        // Test command structure
        console.log('\n5. Command Files:');
        const fs = require('fs');
        const path = require('path');
        
        const commandsPath = path.join(__dirname, 'src', 'commands');
        if (fs.existsSync(commandsPath)) {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            console.log(`📁 Found ${commandFiles.length} command files`);
            
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(commandsPath, file));
                    if ('data' in command && 'execute' in command) {
                        console.log(`✅ ${file}: Valid command structure`);
                    } else {
                        console.log(`❌ ${file}: Missing data or execute property`);
                    }
                } catch (error) {
                    console.log(`❌ ${file}: Error loading - ${error.message}`);
                }
            }
        } else {
            console.log('❌ Commands directory not found');
        }
        
    } catch (error) {
        console.log('❌ API Error:', error.message);
        if (error.code === 0) {
            console.log('💡 This usually means invalid token');
        }
    }
}

runDiagnostic();