const { Events } = require('discord.js');

// Receiving command interactions
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client, player) {
		if (!interaction.isModalSubmit()) return;

		const modal = interaction.client.modals.get(interaction.customId);

		if (!modal) {
			console.error(`No modal matching ${interaction.customId} was found.`);
			return;
		}

		try {
			await modal.execute(interaction, client, player);
		} catch (error) {
			console.error(`Error executing modal ${interaction.customId}`);
			console.error(error);
		}
	},
};
