const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild/discord server
		await interaction.deferReply({
			content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
			ephemeral: true,
		});
		await wait(4000);
		await interaction.editReply(
			'This reply was edited successfully after being deferred.'
		);
	},
};
