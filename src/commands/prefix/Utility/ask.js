const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const {OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API,
});

module.exports = {
    structure: {
        name: 'ask',
        description: 'ask the bot a question',
        aliases: ['ask'],
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        try {
            await message.channel.sendTyping();
            let ConvoLog = [{ role: "system", content: "Discord Chat Bot" }];
      
            let prevMsgs = await message.channel.messages.fetch({ limit: 20 });
            prevMsgs.reverse();
            prevMsgs.forEach((m) => {
              if (m.author.id !== client.user.id && message.author.bot) return;
              if (m.author.id !== message.author.id) return;
      
              ConvoLog.push({
                role: "user",
                content: m.content,
              });
            });
      
            const response = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: ConvoLog,
            });
       
            const repmsg = response.choices[0].message.content;
            for (let i = 0; i < repmsg.length; i += 2000) {
              const toSend = repmsg.substring(i, Math.min(repmsg.length, i + 2000));
              message.channel.send(toSend);
            }
          } catch (e) {
            console.log(e);
          }

        // await message.reply({
        //     content: 'Pong! ' +  client.ws.ping
        // });

    }
};
