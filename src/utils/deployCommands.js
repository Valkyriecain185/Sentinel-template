const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 Command Deployment Script');
console.log('===================================');

// Load commands from the correct path
const commands = [];

// Try multiple possible paths to find commands
const possiblePaths = [
    path.join(__dirname, 'src', 'commands'),
    path.join(__dirname, '..', 'src', 'commands'),
    path.join(process.cwd(), 'src', 'commands'),
    path.join(__dirname, 'commands')
];

let commandsPath = null;

for (const testPath of possiblePaths) {
    console.log(`🔍 Checking: ${testPath}`);
    if (fs.existsSync(testPath)) {
        commandsPath = testPath;
        console.log(`✅ Found commands directory: ${testPath}`);
        break;
    }
}

if (!commandsPath) {
    console.error('❌ Could not find commands directory!');
    console.log('📁 Tried these paths:');
    possiblePaths.forEach(p => console.log(`   - ${p}`));
    process.exit(1);
}

// Load command files
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`📄 Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(`📥 Loading: ${file}`);
    
    try {
        // Clear require cache to ensure fresh load
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded: ${command.data.name} - ${command.data.description}`);
        } else {
            console.log(`⚠️  ${file} missing data or execute property`);
        }
    } catch (error) {
        console.error(`❌ Error loading ${file}:`, error.message);
    }
}

if (commands.length === 0) {
    console.error('❌ No valid commands found!');
    process.exit(1);
}

console.log(`\n📦 Ready to deploy ${commands.length} commands`);

// Deploy commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Starting deployment...');
        
        // Clear existing commands first
        console.log('🧹 Clearing existing commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        );
        console.log('✅ Cleared existing commands');
        
        // Deploy new commands
        console.log('📤 Deploying new commands...');
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        
        console.log(`\n🎉 SUCCESS! Deployed ${data.length} commands:`);
        data.forEach(cmd => {
            console.log(`   /${cmd.name} - ${cmd.description}`);
        });
        
        console.log('\n💡 Commands should appear immediately in Discord!');
        console.log('   Try typing "/" in your server to see them');
        
    } catch (error) {
        console.error('\n❌ Deployment failed:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        
        if (error.rawError && error.rawError.errors) {
            console.error('Details:', JSON.stringify(error.rawError.errors, null, 2));
        }
    }
})();