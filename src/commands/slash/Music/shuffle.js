const { SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
      name: "shuffle",
      description: "shuffle song",
      aliases: ["sh"],
      permissions: "SendMessages",
      inVoiceChannel: true,
      cooldown: 5000,
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     */
    run: async (client, message) => {
        const queue = client.distube.getQueue(message)
        if (!queue) await message.reply({ content : `${client.emotes.error} | There is nothing in the queue right now!`})
        queue.shuffle()
        await message.reply({ content : 'Shuffled songs in the queue'})
      }
    }