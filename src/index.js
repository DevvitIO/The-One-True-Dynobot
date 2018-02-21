require('dotenv').config();

const Discord = require('discord.js');

require('mongoose');
require('./db');

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged into Discord as ${client.user.tag}`);

	require('./lib/collectCookies')(client);
	require('./lib/scrapeMembers')(client);
});

client.login(process.env.DISCORD_TOKEN);
