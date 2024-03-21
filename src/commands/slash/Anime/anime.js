
const axios = require('axios');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Get information about an anime.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the anime.')
                .setRequired(true)
        ),
    /**
    * @param {Interaction} interaction - Represents a Discord interaction
    * @param {Object} interaction - Represents a Discord interaction
     */
    run: async (message,interaction) => {
       

        try {
            const title = interaction.options.getString("title");
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
            const data = response.data.data[0];
            let trailerUrl = "No trailer available";
            if (data.trailer?.youtube_id) {
                trailerUrl = `https://www.youtube.com/watch?v=${data.trailer.youtube_id}`;
            }
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
                    text: "Powered by Anchan",
                    iconURL: "https://cdn.discordapp.com/attachments/897026419832537138/1220126368629657620/jyben.png?ex=660dce3b&is=65fb593b&hm=c506b99a53e5e29e44deb5b70be1253f033f31371b11dad878821a0b6f737476&",
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching anime information.');
        }
    },
};
