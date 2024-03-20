// Prefix:
const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
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
     * @param {ChatInputCommandInteraction<true>} interaction
     * @param {Message<true>} message
     */
    run: async (message,interaction) => {
      // await interaction.deferReply();
        // if (message.author.bot) return;
  
    // Trigger bot if a message starts with ! so that not every message is responded by the bot
      try {
        let ConvoLog = [{ role: "system", content: "Discord Chat Bot" }];
        const mes = interaction.options.getString("message");
        // let prevMsgs = await message.channel.messages.fetch({ limit: 20 });
        // prevMsgs.reverse();
        // prevMsgs.forEach((m) => {
        //   if (m.author.id !== client.user.id && message.author.bot) return;
        //   if (m.author.id !== message.author.id) return;
  
          ConvoLog.push({
            role: "user",
            content: mes,
          });
        // });
  
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: ConvoLog,
        });
   
        const repmsg = response.choices[0].message.content;
        // for (let i = 0; i < repmsg.length; i += 2000) {
        //   const toSend = repmsg.substring(i, Math.min(repmsg.length, i + 2000));
        // if (repmsg.length < 2000) 
        //   await interaction.reply({
        //     content: repmsg,
        //   });
        // else {
          const toSend = repmsg.substring(0,100);
          const attachment = new AttachmentBuilder("chatgpt.txt", Buffer.from(repmsg));
          await interaction.deferReply({ content: "waiting" ,ephemeral: true });
          // if (repmsg.length < 2000) 
          await interaction.editReply({
            content: toSend,
          });
          // else {
          //   const toSend = repmsg.substring(0,10);
          //  await interaction.editReply({
          //   content: toSend,
          //   // files: [attachment]
          // });
          // }
        // }
      } catch (e) {
        console.log(e);
      }
    
    }
};
