require('dotenv').config();

module.exports = {
	data: { name: 'resume' },
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
