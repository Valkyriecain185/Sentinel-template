const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about the bot'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Information')
            .setColor('#0099ff')
            .addFields(
                { name: '📊 Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: '⚡ Commands', value: `${interaction.client.commands.size}`, inline: true },
                { name: '🕒 Uptime', value: `${Math.floor(interaction.client.uptime / 1000 / 60)} minutes`, inline: true },
                { name: '💻 Node.js', value: process.version, inline: true },
                { name: '📦 Discord.js', value: require('discord.js').version, inline: true }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: 'Bot Template', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};