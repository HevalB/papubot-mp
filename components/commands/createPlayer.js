const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('template')
		.setDescription('Creates player template.'),
	async execute(interaction) {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('add')
				.setLabel('Add')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('skip')
				.setLabel('Skip')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('pause')
				.setLabel('Pause')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('resume')
				.setLabel('Resume')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('clear')
				.setLabel('Clear')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true)
		);
		await interaction.guild.channels.cache.get(interaction.channelId).send({
			content: 'Template',
			components: [row],
		});
	},
};
