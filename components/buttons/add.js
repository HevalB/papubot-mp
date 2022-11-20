const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	data: { name: 'add' },
	execute: async (interaction) => {
		// Create a new modal and give it a customId and title
		const modal = new ModalBuilder()
			.setCustomId('songRequest')
			.setTitle('Song request');

		// Create the text input components
		const songUrlInput = new TextInputBuilder()
			.setCustomId('songUrlInput')
			.setLabel('What is the URL of the song/playlist?')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder(
				"If you don't enter an URL, I'll use this as a search term."
			);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(songUrlInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	},
};
