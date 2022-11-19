const {
	Events,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');

// When the client is ready, run this code (only once)
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute: async (client) => {
		console.log(`Fired up and ready to serve! Logged in as ${client.user.tag}`);
	},
};
