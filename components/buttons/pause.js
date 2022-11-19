require('dotenv').config();

module.exports = {
	data: { name: 'pause' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();
		// Get the channel and message data then edit message
		const message = async (newMsg) => {
			const channel = await client.channels.fetch(process.env.CHANNELID);
			const msg = await channel.messages.fetch(process.env.PLAYERMESSAGE);
			msg.edit(newMsg);
		};
		// Get the queue for the player
		const queue = await player.getQueue(interaction.guildId);
		// Check if the queue is empty
		if (!queue) {
			message({
				content: `${interaction.user} there are currently no songs in the queue.`,
			});
			return;
		}
		// Pause the current song
		queue.setPaused(true);
		// Get the message and edit it
		message({
			content: `The player has been paused by ${interaction.user}.`,
		});
	},
};
