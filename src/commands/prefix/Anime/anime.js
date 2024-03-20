const { Message } = require('discord.js');
const axios = require('axios');
const ExtendedClient = require('../../../class/ExtendedClient');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    structure: {
        name: 'anime',
        description: 'ask the bot a question',
        aliases: ['an'],
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const title = 'naruto'

        try {
            // const title = 'naruto'
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
            const data = response.data.data[0];
           
            let trailerUrl = "No trailer available";
            // if (data.trailer?.youtube_id) {
            //   trailerUrl = `https://www.youtube.com/watch?v=${data.trailer.youtube_id}`;
            // }
            const embed = new EmbedBuilder()
                .setTitle(data.title || "N/A")
                .setURL(data.url || "")
                .setColor(0x0099ff)
                .setDescription(data.synopsis || "N/A")
                .setThumbnail(data.images.jpg.image_url || "")
                .addFields(
                    {
                        name: "Type",
                        value: data.type || "N/A", // Use "N/A" if data.type is null
                        inline: true,
                    },
                    {
                        name: "Episodes",
                        value: data.episodes ? data.episodes.toString() : "N/A", // Use "N/A" if data.episodes is null
                        inline: true,
                    },
                    {
                        name: "Start Date",
                        value: data.aired.from || "N/A", // Use "N/A" if data.aired.from is null
                        inline: true,
                    },
                    {
                        name: "End Date",
                        value: data.aired.to || "N/A", // Use "N/A" if data.aired.to is null
                        inline: true,
                    },
                    {
                        name: "Score",
                        value: data.score ? data.score.toString() : "N/A", // Use "N/A" if data.score is null
                        inline: true,
                    },
                    {
                        name: "Rated",
                        value: data.rating || "N/A", // Use "N/A" if data.rating is null
                        inline: true,
                    },
                    {
                        name: "Trailer",
                        value: trailerUrl || "N/A", // Use "N/A" if trailerUrl is null
                        inline: true,
                    }
                )
                .setImage(data.images.jpg.image_url || "")
                .setTimestamp(new Date())
                .setFooter({
                    text: "Powered by Nomekuma",
                    iconURL: "https://avatars.githubusercontent.com/u/122863540?v=4",
                });

                message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
        }
    },
};
