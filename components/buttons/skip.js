const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

const request = require('../modals/songRequest.js');
const playerButtons = require('../actionrows/playerButtons.js');

module.exports = {
	data: { name: 'skip' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();

		// Create a play queue for the server
		const queue = await player.getQueue(interaction.guildId);

		// Skip song, used .play method instead of .skip because the latter causes buffering issues
		if (queue.tracks.length !== 0) {
			queue.play(queue.tracks.shift(), { immediate: true });
		} else {
			queue.destroy();
			request.message.message({
				content: `Queue has ended. Add more songs to it to resume play.`,
				embeds: [
					new EmbedBuilder().setDescription(
						`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
					),
				],
				components: [playerButtons.disabled],
			});
			return;
		}

		// Wait until you are connected to the channel
		if (!queue.connection) queue.connect(interaction.member.voice.channel);

		// Get the previous song
		const prevSong = queue.previousTracks.slice(-2, -1).map((song) => {
			return `${song.title} - ${song.author} - has been skipped by ${interaction.user}`;
		});

		// Update the discord message of where the player resides
		request.message.message({
			content: `${prevSong}`,
			components: [playerButtons.enabled],
		});
	},
};
