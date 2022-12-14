const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	disabled: new ActionRowBuilder().addComponents(
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
	),
	enabled: new ActionRowBuilder().addComponents(
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
	),
};
