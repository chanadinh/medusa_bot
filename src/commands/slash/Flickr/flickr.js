const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require('axios').default;
const fs = require('fs')  

module.exports = {
    structure: new SlashCommandBuilder()
    .setName('flickr')
    .setDescription('Get a photo from Flickr.')
    .addStringOption(option =>
        option.setName('keyword')
            .setDescription('The keyword to search for.')
    ),
    /**
    * @param {ExtendedClient} client 
    * @param {Message<true>} message 
    * @param {string[]} args 
    * @param {ChatInputCommandInteraction} interaction
    */
    run: async (client, interaction) => {
 
        const apiKey = 'c05739dd4b3b87f5fc8ab9cca32872ad';

        try {
            const photoraw = interaction.options.getString("keyword");
            function getRandomInt(min, max) {
                const minCeiled = Math.ceil(min);
                const maxFloored = Math.floor(max);
                return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
              }
            // Make a request to the Flickr API to get photo information
            const response = await axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${photoraw}&sort=relevance&safe_search=3&api_key=${apiKey}&format=json&nojsoncallback=1`);
            const data = response.data;
            const photoIndex = getRandomInt(0, data.photos.photo.length);
            const photoId = response.data.photos.photo[photoIndex].id;
            const photoOwner = response.data.photos.photo[photoIndex].owner;
            const response2 = await axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=${photoId}&photo_owner=${photoOwner}&api_key=${apiKey}&format=json&nojsoncallback=1`);
            const data2 = response2.data;
            const downloadUrl = data2.sizes.size[Math.floor(data2.sizes.size.length)-1].source;
          
            if (data.stat !== 'ok') {
                return message.reply('Failed to fetch photo information from Flickr!');
            }
            // Send the photo to the channel
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Flickr Photo')
                        .setImage(downloadUrl)
                ],
                // content: 'Here is a photo from Flickr!',
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setURL(downloadUrl)
                                .setLabel('Download')
                                .setStyle(5)
                        ),
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply('An error occurred while fetching photo information from Flickr!');
        }
    },
};
