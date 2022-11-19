const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		/*
		await interaction.reply({
			content: `Pong! Websocked heartbeat: ${interaction.client.ws.ping}ms.`,
			ephemeral: true,
		});
		*/
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
