const { Events } = require('discord.js');

// Receiving command interactions
module.exports = {
	name: 'buffering',
	async execute(interaction, client, player) {
		if (
			player.queues.get('1040174713839824986').connection.audioPlayer._state
				.status === 'buffering'
		) {
			console.log('BUFFERING!!!!!!');
			const nextTrack = player.queues.get('1040174713839824986').tracks.shift();
			player.queues
				.get('1040174713839824986')
				.play(nextTrack, { immediate: true });
		} else if (
			player.queues.get('1040174713839824986').connection.audioPlayer._state
				.status === 'playing'
		) {
			console.log('NOT BUFFERING!!!!!!!!!!!!!');
		}
	},
};
