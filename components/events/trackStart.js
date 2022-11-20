const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'trackStart',
	async execute(queue) {
		const message = async (newMsg) => {
			const channel = await queue.player.client.channels.fetch(
				queue.metadata.channel.id
			);
			const messages = await channel.messages.fetch();
			if (channel.name.includes('music-bot')) {
				messages.map((msg) => {
					if (
						msg.embeds.length !== 0 &&
						msg.embeds[0].data.description.includes('Queue')
					) {
						msg.edit(newMsg);
					}
				});
			} else {
				console.log('NOT IN MUSIC CHANNEL');
			}
		};

		const queueString = queue.tracks
			.slice(0, 20)
			.map((song, i) => {
				return `${i + 1}) \`[${song.duration}]\` ${song.title} - ${
					song.author
				} - <@${song.requestedBy.id}>`;
			})
			.join('\n');
		const currentSong = queue.current;

		message({
			embeds: [
				new EmbedBuilder().setDescription(
					`**Currently Playing**\n` +
						(currentSong
							? `\`[${currentSong.duration}]\` ${currentSong.title} - ${currentSong.author} - <@${currentSong.requestedBy.id}>`
							: 'None') +
						`\n\n**Queue**\n${queueString}`
				),
			],
		});
	},
};
