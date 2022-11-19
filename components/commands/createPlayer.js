const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('template')
		.setDescription('Creates player template.'),
	async execute(interaction) {
		await interaction.guild.channels.cache.get(interaction.channelId).send({
			content: 'Template',
		});
	},
};
