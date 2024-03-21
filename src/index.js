require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs')
// const config = require('.config/')
// client.emotes = config.emoji;
const client = new ExtendedClient();
const Format = Intl.NumberFormat();
// .on("searchDone", () => {})
client.start();

// Handles errors and avoids crashes, better to not remove them.
process.env.YTSR_NO_UPDATE = "1";
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);