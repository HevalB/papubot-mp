const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
require('dotenv').config();

module.exports = {
	data: { name: 'skip' },
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
		// Disable buttons
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
		// Create a play queue for the server
		const queue = await player.getQueue(interaction.guildId);
		// Skip song, used .play method instead of .skip because the latter causes buffering issues
		if (queue.tracks.length !== 0) {
			queue.play(queue.tracks.shift(), { immediate: true });
		} else {
			queue.destroy();
			message({
				content: `Queue has ended. Add more songs to it to resume play.`,
				embeds: [
					new EmbedBuilder().setDescription(
						`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
					),
				],
				components: [row],
			});
			return;
		}
		// Wait until you are connected to the channel
		if (!queue.connection) queue.connect(interaction.member.voice.channel);
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
		message({
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
	},
};
