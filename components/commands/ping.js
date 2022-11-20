const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		const channel = await client.channels.fetch(interaction.channelId);
		const messages = await channel.messages.fetch();

		messages.map((msg) => {
			if (msg.content.includes('song')) {
				console.log(msg.content);
			}
		});

		const sent = await interaction.reply({
			content: 'Pinging...',
			fetchReply: true,
		});

		await interaction.editReply({
			content: `Pong again! Roundtrip latency: ${
				sent.createdTimestamp - interaction.createdTimestamp
			}ms.`,
			ephemeral: true,
		});
	},
};
