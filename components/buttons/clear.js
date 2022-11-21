const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const request = require('../modals/songRequest.js');
const playerButtons = require('../actionrows/playerButtons.js');

module.exports = {
	data: { name: 'clear' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();

		// Get the current queue
		const queue = await player.getQueue(interaction.guildId);

		// If there is no queue, return
		if (!queue) {
			request.message.message({
				content: `${interaction.user} there are currently no songs in the queue.`,
				components: [playerButtons.disabled],
			});
			return;
		}

		// Deletes all the songs from the queue and exits the voice channel
		queue.destroy();
		request.message.message({
			content: `The queue has been cleared by ${interaction.user}!`,
			embeds: [
				new EmbedBuilder().setDescription(
					`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
				),
			],
			components: [playerButtons.disabled],
		});
	},
};
