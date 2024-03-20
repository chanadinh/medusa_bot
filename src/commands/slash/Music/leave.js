const { SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
      name: "leave",
      description: "bot leave the voice channel",
      aliases: ["le"],
      permissions: "SendMessages",
      inVoiceChannel: true,
      cooldown: 5000,
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     */
    run: async (client, message) => {
        client.distube.voices.leave(message)
        await message.reply({content:`| I have left the voice channel!`})
      }
    }