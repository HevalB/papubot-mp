const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { update } = require('lodash');
const { setTokenSourceMapRange } = require('typescript');
const {
	channelId,
	messageId,
	playerMessage,
	guildId,
} = require('../../config.json');

module.exports = {
	data: { name: 'skip' },
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();
		// Get the channel data
		const channel = await client.channels.fetch(channelId);
		// Enable buttons
		const enableRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('add')
				.setLabel('Add')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('skip')
				.setLabel('Skip')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('pause')
				.setLabel('Pause')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('resume')
				.setLabel('Resume')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('clear')
				.setLabel('Clear')
				.setStyle(ButtonStyle.Danger)
		);
		// Create a play queue for the server
		const queue = await player.getQueue(interaction.guildId);
		// Skip song, used .play method instead of .skip because the latter causes buffering issues
		if (queue) {
			await queue.play(queue.tracks.shift(), { immediate: true });
		}
		// Wait until you are connected to the channel
		if (!queue.connection)
			await queue.connect(interaction.member.voice.channel);
		// Get the current song
		const currentSong = queue.current;
		// Get the first 20 songs in the queue
		const queueString = queue.tracks
			.slice(0, 20)
			.map((song, i) => {
				return `${i + 1}) \`[${song.duration}]\` ${song.title} - ${
					song.author
				} - ${interaction.user}`;
			})
			.join('\n');
		// Get the previous song
		const prevSong = queue.previousTracks.slice(-2, -1).map((song) => {
			return `${song.title} - ${song.author} - has been skipped by ${interaction.user}`;
		});
		// Update the discord message of where the player resides
		await channel.messages.fetch(playerMessage).then((msg) => {
			msg.edit({
				content: `${prevSong}`,
				embeds: [
					new EmbedBuilder().setDescription(
						`**Currently Playing**\n` +
							(currentSong
								? `\`[${currentSong.duration}]\` ${currentSong.title} - ${currentSong.author} - ${interaction.user}`
								: 'None') +
							`\n\n**Queue**\n${queueString}`
					),
				],
				components: [enableRow],
			});
		});
	},
};
