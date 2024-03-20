const { SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
      name: "autoplay",
      description: "autoplay Command",
      aliases: ["ap"],
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
        const autoplay = queue.toggleAutoplay()
        await message.reply({
            content: `AutoPlay: \`${autoplay ? 'On' : 'Off'}\``,
          });
        // message.channel.send(`AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
      }
    }