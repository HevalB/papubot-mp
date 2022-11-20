const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.on('ready', () => {
	const updateCommands = (guildId) => {
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
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
		// Deploy the commands
		(async () => {
			try {
				console.log(
					`Started refreshing ${commands.length} application (/) commands.`
				);

				// The put method is used to fully refresh all commands in the guild with the current set, remove guildId once you are ready to deploy globally
				const data = await rest.put(
					Routes.applicationGuildCommands(process.env.CLIENTID, guildId),
					// Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands }
				);

				console.log(
					`Successfully reloaded ${data.length} application (/) commands.`
				);
			} catch (error) {
				// Catch and log errors
				console.error(error);
			}
		})();
	};

	// Execute all of the above for every guild.id found on the client.
	client.guilds.cache.map((guild) => {
		updateCommands(guild.id);
		console.log(guild.id);
	});
	// Logout of the client once finished deploying commands
	client.destroy();
});

client.login(process.env.TOKEN);
