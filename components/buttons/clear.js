const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
require('dotenv').config();

module.exports = {
	data: { name: 'clear' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();
		// Get the channel and message data then edit message
		const message = async (newMsg) => {
			// Channel and message data
			const channel = await client.channels.fetch(interaction.channelId);
			const messages = await channel.messages.fetch();
			// Check if user is executing the command from text channel 'music-bot'
			if (channel.name.includes('music-bot')) {
				// map the array returned by messages
				messages.map((msg) => {
					// Check if string 'Queue' exists inside a message embed in the channel
					if (
						msg.embeds.length !== 0 &&
						msg.embeds[0].data.description.includes('Queue')
					) {
						// if so, edit message
						msg.edit(newMsg);
					} else {
						console.log('ERROR! Couldnt find player message.');
					}
				});
			} else {
				console.log('NOT IN MUSIC CHANNEL');
			}
		};
		// Get the current queue
		const queue = await player.getQueue(interaction.guildId);
		// Disable all of these buttons if there are no songs in the queue
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
		// If there is no queue, return
		if (!queue) {
			message({
				content: `${interaction.user} there are currently no songs in the queue.`,
				components: [row],
			});
			return;
		}
		// Deletes all the songs from the queue and exits the voice channel
		queue.destroy();
		message({
			content: `The queue has been cleared by ${interaction.user}!`,
			embeds: [
				new EmbedBuilder().setDescription(
					`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
				),
			],
			components: [row],
		});
	},
};
