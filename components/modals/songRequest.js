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
			const channel = await client.channels.fetch(process.env.CHANNELID);
			const msg = await channel.messages.fetch(process.env.PLAYERMESSAGE);
			msg.edit(newMsg);
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
		const queue = await player.createQueue(interaction.guild);
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
		let embed = new EmbedBuilder();
		// Check if request is a playlist or a song, discord-player has different methods depending on which it is
		if (songPlaylist && result.tracks.length !== 0) {
			await queue.addTracks(result.tracks);
			embed
				.setDescription(
					`**${result.tracks.length} songs from [${result.playlist.title}](${result.playlist.url})** have been added to the Queue`
				)
				.setThumbnail(result.playlist.thumbnail.url);
		} else if (result.tracks[0]) {
			await queue.addTrack(result.tracks[0]);
			embed
				.setDescription(
					`**[${result.tracks[0].title}](${result.tracks[0].url})** has been added to the Queue`
				)
				.setThumbnail(result.tracks[0].thumbnail)
				.setFooter({ text: `Duration: ${result.tracks[0].duration}` });
		} else {
			if (queue.tracks.length !== 0) {
				message({
					content: `No songs found with ${url}`,
					components: [enableRow],
				});
			} else {
				message({
					content: `No songs found with ${url}`,
					components: [row],
				});
			}
		}
		// Play the song
		if (!queue.playing)
			await queue.play(queue.tracks.shift(), { immediate: true });
		// Get the current song
		const currentSong = queue.current;
		// Get the first 20 songs in the queue
		const queueString = queue.tracks
			.slice(0, 20)
			.map((song, i) => {
				return `${i + 1}) \`[${song.duration}]\` ${song.title} - ${
					song.author
				} - <@${song.requestedBy.id}>`;
			})
			.join('\n');
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
		// Constantly check if song is buffering, play gets stuck if it is. .play() method needs to be called again if that is the case.
		const checkBuffering = () => {
			if (!player.queues.get(process.env.GUILDID)?.connection) {
				stopBufferingTimer();
			} else if (
				player.queues.get(process.env.GUILDID).connection.audioPlayer._state
					.status === 'buffering'
			) {
				queue.play(queue.current, { immediate: true });
			}
		};
		const bufferingTimer = setInterval(() => {
			checkBuffering();
		}, 5000);
		const stopBufferingTimer = () => {
			clearInterval(bufferingTimer);
		};
	},
};
