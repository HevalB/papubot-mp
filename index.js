// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

const { Player } = require('discord-player');

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Create a new player
const player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	},
});

// Loading event files
const eventsPath = path.join(__dirname, '/components/events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) =>
			event.execute(...args, client, player)
		);
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, player));
	}
}

// Loading command files
client.commands = new Collection();

const commandsPath = path.join(__dirname, '/components/commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

// Loading button files
client.buttons = new Collection();

const buttonsPath = path.join(__dirname, '/components/buttons');
const buttonFiles = fs
	.readdirSync(buttonsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of buttonFiles) {
	const filePath = path.join(buttonsPath, file);
	const button = require(filePath);
	// Set a new item in the Collection with the key as the button name and the value as the exported module
	if ('data' in button && 'execute' in button) {
		client.buttons.set(button.data.name, button);
	} else {
		console.log(
			`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

// Loading modal files
client.modals = new Collection();

const modalsPath = path.join(__dirname, '/components/modals');
const modalFiles = fs
	.readdirSync(modalsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of modalFiles) {
	const filePath = path.join(modalsPath, file);
	const modal = require(filePath);
	// Set a new item in the Collection with the key as the modal name and the value as the exported module
	if ('data' in modal && 'execute' in modal) {
		client.modals.set(modal.data.name, modal);
	} else {
		console.log(
			`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

// Log in to Discord with your client's token
client.login(token);
