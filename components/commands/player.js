const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription(
			"Creates player message. Must have an empty text channel named '#music-bot' to use this command."
		),
	async execute(interaction, client) {
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

		const channel = await client.channels.fetch(interaction.channelId);
		const messages = await channel.messages.fetch();

		if (channel.name.includes('music-bot')) {
			if (messages.size === 0) {
				await interaction.channel.send({
					content:
						'There are no songs in the queue. Click add to play some music.',
					embeds: [
						new EmbedBuilder().setDescription(
							`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
						),
					],
					components: [row],
				});
				await interaction.deferReply('');
				await interaction.deleteReply();
			} else if (messages.size > 0) {
				messages.map((msg) => {
					if (
						msg.embeds.length !== 0 &&
						msg.embeds[0].data.description.includes('Queue')
					) {
						interaction.reply({
							content: 'There is already a player in here!',
							ephemeral: true,
						});
					}
				});
			} else {
				interaction.reply({
					content:
						'Please delete all of the messages in this channel and make it view only.',
				});
			}
		} else {
			interaction.reply({
				content: 'Not in #music-bot channel!',
				ephemeral: true,
			});
		}
	},
};
