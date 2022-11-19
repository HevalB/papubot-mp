const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandOptionType } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	{
		name: 'play',
		description: 'Plays a song!',
		options: [
			{
				name: 'query',
				type: ApplicationCommandOptionType.String,
				description: 'The song you want to play',
				required: true,
			},
		],
	},
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application [/] commands.');

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log('Successfully reloaded application [/] commands.');
	} catch (error) {
		console.error(error);
	}
})();
