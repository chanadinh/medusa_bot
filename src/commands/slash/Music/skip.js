const { SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
      name: "skip",
      description: "skip song",
      aliases: ["sk"],
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
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        try {
          const song = await queue.skip()
          await message.reply({content:`| Skipped! Now playing:\n${song.name}`})
        } catch (e) {
            await message.reply({ content : `${client.emotes.error} | ${e}`})
        }
      }
    }