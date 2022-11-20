const { QueryType } = require('discord-player');
const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
require('dotenv').config();

module.exports = {
	data: {
		name: 'songRequest',
	},
	execute: async (interaction, client, player) => {
		// Prevent 'This interaction failed' messages when working with .send and .edit instead of .reply and .editReply
		interaction.deferUpdate();

		// Get the channel and message data then edit message
		const message = async (newMsg) => {
			const channel = await client.channels.fetch(interaction.channelId);
			const messages = await channel.messages.fetch();
			if (channel.name.includes('music-bot')) {
				messages.map((msg) => {
					if (
						msg.embeds.length !== 0 &&
						msg.embeds[0].data.description.includes('Queue')
					) {
						msg.edit(newMsg);
					} else {
						console.log('ERROR! Couldnt find player message.');
					}
				});
			} else {
				console.log('NOT IN MUSIC CHANNEL');
			}
		};

		// Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) {
			message({
				content: `${interaction.user} you need to be in a voice channel in order to play a song/playlist.`,
			});
			return;
		}

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
		const queue = await player.createQueue(interaction.guild, {
			options: {
				leaveOnEnd: true,
			},
			metadata: {
				channel: interaction.channel,
			},
		});

		// Wait until you are connected to the channel
		if (!queue.connection)
			await queue.connect(interaction.member.voice.channel);

		// Variables for the string inside of the input modal
		const url = await interaction.fields.getTextInputValue('songUrlInput');
		const urlConditions = ['track', 'watch?v'];
		const urlExclusions = ['www', 'http', 'https'];
		const songPlaylist = url.includes('list');
		let result;

		// Check what the user input is and act accordingly
		if (!urlExclusions.some((condition) => url.includes(condition))) {
			result = await player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});
		} else if (urlConditions.some((condition) => url.includes(condition))) {
			// Search for the song using the discord-player
			if (url.includes('spotify')) {
				result = await player.search(url, {
					requestedBy: interaction.user,
					searchEngine: QueryType.SPOTIFY_SONG,
				});
			} else if (url.includes('youtube')) {
				result = await player.search(url, {
					requestedBy: interaction.user,
					searchEngine: QueryType.YOUTUBE_VIDEO,
				});
			} else {
				message({
					content: `No songs found with ${url}`,
					components: [row],
				});
			}
		} else if (songPlaylist) {
			// Search for the playlist using the discord-player
			if (url.includes('spotify')) {
				result = await player.search(url, {
					requestedBy: interaction.user,
					searchEngine: QueryType.SPOTIFY_PLAYLIST,
				});
			} else if (url.includes('youtube')) {
				result = await player.search(url, {
					requestedBy: interaction.user,
					searchEngine: QueryType.YOUTUBE_PLAYLIST,
				});
			} else {
				message({
					content: `No playlists found with ${url}`,
					components: [row],
				});
			}
		}

		// Check if request is a playlist or a song, discord-player has different methods depending on which it is
		if (songPlaylist && result.tracks.length !== 0) {
			console.log('playlist added');
			await queue.addTracks(result.tracks);
			message({
				content: `**${result.tracks.length} songs from ${result.playlist.title}** have been added to the queue by <@${queue.current.requestedBy.id}>`,
			});
		} else if (result.tracks[0]) {
			await queue.addTrack(result.tracks[0]);
			message({
				content: `**${result.tracks[0].title}** has been added to the queue by <@${queue.current.requestedBy.id}>`,
			});
		} else {
			if (queue.tracks.length !== 0) {
				message({
					content: `<@${queue.current.requestedBy.id}>No songs found with ${url}`,
					components: [enableRow],
				});
			} else {
				message({
					content: `<@${queue.current.requestedBy.id}>No songs found with ${url}`,
					components: [row],
				});
			}
		}

		// Play the song
		if (!queue.playing)
			await queue.play(queue.tracks.shift(), { immediate: true });

		const queueString = queue.tracks
			.slice(0, 20)
			.map((song, i) => {
				return `${i + 1}) \`[${song.duration}]\` ${song.title} - ${
					song.author
				} - <@${song.requestedBy.id}>`;
			})
			.join('\n');
		const currentSong = queue.current;
		// Update the player message
		if (await result.tracks[0]) {
			message({
				content: `${interaction.user} your song request has been successfully received!`,
				embeds: [
					new EmbedBuilder().setDescription(
						`**Currently Playing**\n` +
							(currentSong
								? `\`[${currentSong.duration}]\` ${currentSong.title} - ${currentSong.author} - <@${currentSong.requestedBy.id}>`
								: 'None') +
							`\n\n**Queue**\n${queueString}`
					),
				],
				components: [enableRow],
			});
		}

		// Check if song is buffering, play gets stuck if it is. .play() method needs to be called again if that is the case.
		const checkBuffering = () => {
			if (!player.queues.get(interaction.guildId)?.connection) {
				stopBufferingTimer();
			} else if (
				player.queues.get(interaction.guildId).connection.audioPlayer._state
					.status === 'buffering'
			) {
				queue.play(queue.current, { immediate: true });
			}
		};

		// Execute checkBuffering() every 5 seconds.
		const bufferingTimer = setInterval(() => {
			checkBuffering();
		}, 5000);

		// Clear the bufferingTimer interval set for checkBuffering()
		const stopBufferingTimer = () => {
			clearInterval(bufferingTimer);
		};
	},
};
