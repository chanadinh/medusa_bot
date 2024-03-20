const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../schemas/GuildSchema');
const axios = require('axios').default;
const date = require('date-and-time');
const calendar = new AttachmentBuilder('./assets/calendar.png');
const f1 = new AttachmentBuilder('./assets/f1.png');
const jyben = new AttachmentBuilder('./assets/jyben.png');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('calender')
        .setDescription('f1 calender for the week'),
    options: {
        cooldown: 15000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const response = await getScheduleAsync();
        const embed = getEmbed(response[0].Circuit.Location.locality,
            response[0].Circuit.Location.country,
            date.transform(response[0].FirstPractice.date, 'YYYY-MM-DD', 'DD/MM',) + ' - ' + response[0].FirstPractice.time.slice(0, -4),
            date.transform(response[0].SecondPractice.date, 'YYYY-MM-DD', 'DD/MM') + ' - ' + response[0].SecondPractice.time.slice(0, -4),
            response[0].ThirdPractice === undefined ? "Pas de FP3" : date.transform(response[0].ThirdPractice.date, 'YYYY-MM-DD', 'DD/MM') + ' - ' + response[0].ThirdPractice.time.slice(0, -4),
            date.transform(response[0].Qualifying.date, 'YYYY-MM-DD', 'DD/MM') + ' - ' + response[0].Qualifying.time.slice(0, -4),
            response[0].Sprint === undefined ? "Pas de sprint" : date.transform(response[0].Sprint.date, 'YYYY-MM-DD', 'DD/MM') + ' - ' + response[0].Sprint.time.slice(0, -4),
            date.transform(response[0].date, 'YYYY-MM-DD', 'DD/MM') + ' - ' + response[0].time.slice(0, -4));

        await interaction.reply({ embeds: [embed], files: [calendar, f1, jyben] });
        
        function getEmbed(locality, country, fp1, fp2, fp3, quali, sprint, race) {
            return new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: 'F1 calendar of the week', iconURL: 'attachment://calendar.png' })
                .setThumbnail('attachment://f1.png')
                .addFields(
                    { name: 'Circuit', value: `${locality} - ${country}` },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Free practice 1️⃣', value: fp1, inline: true },
                    { name: 'Free practice 2️⃣', value: fp2, inline: true },
                    { name: 'Free practice 3️⃣', value: fp3, inline: true },
                    { name: 'Qualification ⏱', value: quali, inline: true },
                    { name: 'Course sprint 🏎', value: sprint, inline: true },
                    { name: 'Course principale 🏁', value: race, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Timezone', value: 'UTC' },
                )
                .setTimestamp()
                .setFooter({ text: 'Built by Anchan', iconURL: 'attachment://jyben.png' })
        } // Add a comma here
        async function getScheduleAsync() {
            const response = await axios.get('http://ergast.com/api/f1/current.json');
            const races = response.data.MRData.RaceTable.Races;
            const now = new Date()
        
            return races.filter(x => x.date >= date.format(now, 'YYYY-MM-DD'));
        }
    }, // Add a comma here

    
};
