const { SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require("axios");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption(option =>
            option
                .setName('music')
                .setDescription('The song you want to play')
                .setRequired(true)
            ),
   /**
     * 
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client,interaction) => {
        const keyword = interaction.options.getString('music');

        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `🚫 | You must be in a voice channel to use this command!`
                        ),
                ],
                ephemeral: true,
            });
        }

        if (queue) {
            if (
                interaction.guild.members.me.voice.channelId !==
                interaction.member.voice.channelId
            ) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `🚫 | You need to be on the same voice channel as the Bot!`
                            ),
                    ],
                    ephemeral: true,
                });
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔍 | Looking for a song...`),
            ],
            ephemeral: true,
        });

        client.distube.play(voiceChannel, keyword, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔍 | Successful search!`),
            ],
            ephemeral: true,
        });
    },
};