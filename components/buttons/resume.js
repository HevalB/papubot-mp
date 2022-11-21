require('dotenv').config();
const request = require('../modals/songRequest.js');

module.exports = {
	data: { name: 'resume' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();

		// Get the queue for the player
		const queue = player.getQueue(interaction.guildId);

		// Check if the queue is empty
		if (!queue) {
			request.message.message({
				content: `${interaction.user} there are currently no songs in the queue.`,
			});
			return;
		}

		// Pause the current song
		queue.setPaused(false);
		queue.play(queue.nowPlaying());

		// Get the message and edit it
		request.message.message({
			content: `The player has been resumed by ${interaction.user}.`,
		});
	},
};
