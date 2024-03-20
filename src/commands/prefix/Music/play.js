const { Message } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
  structure: {
      name: 'play',
      description: 'play a song',
      aliases: ['p'],
      inVoiceChannel: true,
      cooldown: 5000
  },
  /**
   * @param {ExtendedClient} client 
   * @param {Message<true>} message 
   * @param {string[]} args 
   */
    run: async (client, message, args) => {
      const string = args.join(' ')
      if (!string) return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`)
      client.distube.play(message.member.voice.channel, string, {
        member: message.member,
        textChannel: message.channel,
        message
      })
    }
  }