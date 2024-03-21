const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require('axios').default;
const fs = require('fs')  

module.exports = {
    structure: {
        name: 'flickr',
        description: 'Get information about a Flickr photo',
        aliases: ['ask'],
        cooldown: 5000
    },
    /**
    * @param {ExtendedClient} client 
    * @param {Message<true>} message 
    * @param {string[]} args 
    */
    run: async (client, message, args) => {
        // Check if the user provided a photo ID
        if (!args[0]) {
            return message.reply('Please provide a photo ID!');
        }

        const photoraw = args.join(' ');
        // const photo = photoraw.replace(' ', '%20');
        const apiKey = 'c05739dd4b3b87f5fc8ab9cca32872ad';

        try {
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
            // const writer = fs.createWriteStream('image.jpg');
            // const getImgName = (downloadUrl) => downloadUrl.slice(downloadUrl.lastIndexOf('/') + 1, downloadUrl.lastIndexOf('.'));
            // const response3 = await axios.get(downloadUrl, {
            //     responseType: 'stream'
            //   });	
            //   response3.data.pipe(writer);

   
            //   const mimeType = response3.headers['content-type'];
            //     const fileExtension = mimeType.split('/')[1];
            
            // Check if the request was successful
            if (data.stat !== 'ok') {
                return message.reply('Failed to fetch photo information from Flickr!');
            }

            const photoInfo = data.photo;

            // Display the photo information
            // message.channel.send(`Title: ${photoInfo.title._content}`);
            // message.channel.send(`https://www.flickr.com/photos/${photoOwner}/${photoId}/`);
            message.channel.send(downloadUrl);
            // message.channel.send(getImgName(downloadUrl));
            // message.channel.send(fileExtension);
            // message.channel.send(String(data2.sizes.size.length));
            // message.channel.send(`Owner: ${photoInfo.owner.username}`);

            // message.channel.send(`Description: ${photoInfo.description._content}`);
            // message.channel.send(`Tags: ${photoInfo.tags.tag.map(tag => tag._content).join(', ')}`);
            // message.channel.send(`Views: ${photoInfo.views}`);
            // Add more fields as needed

            // You can also do additional processing or formatting of the photo information here

            // End the command
        } catch (error) {
            console.error(error);
            return message.reply('An error occurred while fetching photo information from Flickr!');
        }
    },
};
