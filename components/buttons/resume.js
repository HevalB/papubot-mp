const { channelId, playerMessage } = require('../../config.json');

module.exports = {
	data: { name: 'resume' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();
		// Get the channel data
		const channel = await client.channels.fetch(channelId);
		// Function to edit the message with the player
		const message = async (newMsg) => {
			await channel.messages.fetch(playerMessage).then((msg) => {
				msg.edit(newMsg);
			});
		};
		// Get the queue for the player
		const queue = player.getQueue(interaction.guildId);
		// Check if the queue is empty
		if (!queue) {
			message({
				content: `${interaction.user} there are currently no songs in the queue.`,
			});
			return;
		}
		// Pause the current song
		queue.setPaused(false);
		queue.play(queue.nowPlaying());
		// Get the message and edit it
		message({
			content: `The player has been resumed by ${interaction.user}.`,
		});
	},
};
