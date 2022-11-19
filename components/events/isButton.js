const { Events } = require('discord.js');

// Receiving command interactions
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client, player) {
		if (!interaction.isButton()) return;

		const button = interaction.client.buttons.get(interaction.customId);

		if (!button) {
			console.error(`No button matching ${interaction.customId} was found.`);
			return;
		}

		try {
			await button.execute(interaction, client, player);
		} catch (error) {
			console.error(`Error executing button ${interaction.customId}`);
			console.error(error);
		}
	},
};
