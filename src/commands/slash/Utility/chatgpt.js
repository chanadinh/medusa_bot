// Prefix:
const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { Message, PermissionFlagBits } = require('discord.js');
const {OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API,
});


// Message:

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Chat with the bot using GPT-3.5 Turbo')
        .addStringOption((opt) => 
            opt.setName('message')
                .setDescription('The message to send to the bot')
                .setRequired(true)
        ),
     /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, message, args) => {
        // if (message.author.bot) return;
  
    // Trigger bot if a message starts with ! so that not every message is responded by the bot
      try {
        await message.channel.sendTyping();
        let ConvoLog = [{ role: "system", content: "Discord Chat Bot" }];
  
        let prevMsgs = await message.channel.messages.fetch({ limit: 20 });
        prevMsgs.reverse();
        prevMsgs.forEach((m) => {
        //   if (m.author.id !== client.user.id && message.author.bot) return;
        //   if (m.author.id !== message.author.id) return;
  
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
    
    }
};
