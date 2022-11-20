const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'queueEnd',
	async execute(queue) {
		console.log('queue end');
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

		message({
			content: 'Queue has ended. Add more songs to it to resume play.',
			embeds: [
				new EmbedBuilder().setDescription(
					`**Currently Playing**\n` + 'None' + `\n\n**Queue**\n`
				),
			],
		});
	},
};
