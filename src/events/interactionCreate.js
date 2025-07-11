module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        // Check if commands are loaded
        if (!interaction.client.commands) {
            console.log('⚠️  Commands collection not initialized');
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`⚠️  No handler found for command: ${interaction.commandName}`);
            console.log('💡 Command might be deployed but not loaded in bot code');
            
            await interaction.reply({ 
                content: 'This command exists but has no handler. Check bot logs.', 
                ephemeral: true 
            });
            return;
        }

        try {
            console.log(`🔧 Executing command: ${interaction.commandName}`);
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error executing ${interaction.commandName}:`, error);
            
            const errorMessage = 'There was an error while executing this command!';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};