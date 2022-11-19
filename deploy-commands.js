const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory
const commandFiles = fs
	.readdirSync('./components/commands')
	.filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./components/commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);
// and deploy the commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set, remove guildId once you are ready to deploy globally
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			// Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure to catch and log any errors!
		console.error(error);
	}
})();
