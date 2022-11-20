const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('template')
		.setDescription(
			"Creates player template. Must have a text channel named '#music-bot' to use this command."
		),
	async execute(interaction, client) {
		/*
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
		*/
		const channel = await client.channels.fetch(interaction.channelId);
		const messages = await channel.messages.fetch();

		if (channel.name.includes('music-bot')) {
			messages.map((msg) => {
				if (
					msg.embeds.length !== 0 &&
					msg.embeds[0].data.description.includes('Queue')
				) {
					msg.edit({ content: 'blaa' });
				}
			});
		} else {
			console.log('NOT IN MUSIC CHANNEL');
		}
	},
};
