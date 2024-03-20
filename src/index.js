require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const { DisTube } = require('distube')
const { EmbedBuilder } = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const client = new ExtendedClient();
const Format = Intl.NumberFormat();
let spotifyOptions = {
    parallel: true,
    emitEventsAfterFetching: false,
};
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
})
const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
    }\` | Repeat: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "Playlist"
                : "Song"
            : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube.on("addSong", async (queue, song) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                

                .setAuthor({
                    name: "Add song to queue",
                    iconURL: client.user.avatarURL(),
                })
                .setDescription(`> [**${song.name}**](${song.url})`)
                .setThumbnail(song.user.displayAvatarURL())
                .addFields([
                    {
                        name: "⏱️ | Time",
                        value: `${song.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "🎵 | Upload",
                        value: `[${song.uploader.name}](${song.uploader.url})`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${song.user}`,
                        inline: true,
                    },
                ])
                .setImage(song.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("addList", async (queue, playlist) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
               
                .setAuthor({
                    name: "Add playlist to queue",
                    iconURL: client.user.avatarURL(),
                })
                .setThumbnail(playlist.user.displayAvatarURL())
                .setDescription(`> [**${playlist.name}**](${playlist.url})`)
                .addFields([
                    {
                        name: "⏱️ | Time",
                        value: `${playlist.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${playlist.user}`,
                        inline: true,
                    },
                ])
                .setImage(playlist.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("playSong", async (queue, song) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
             
                .setAuthor({
                    name: "Now playing",
                    iconURL: client.user.avatarURL(),
                })
                .setDescription(`> [**${song.name}**](${song.url})`)
                .setThumbnail(song.user.displayAvatarURL())
                .addFields([
                    {
                        name: "🔷 | Status",
                        value: `${status(queue).toString()}`,
                        inline: false,
                    },
                    {
                        name: "👀 | Views",
                        value: `${Format.format(song.views)}`,
                        inline: true,
                    },
                    {
                        name: "👍 | Likes",
                        value: `${Format.format(song.likes)}`,
                        inline: true,
                    },
                    {
                        name: "⏱️ | Time",
                        value: `${song.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "🎵 | Upload",
                        value: `[${song.uploader.name}](${song.uploader.url})`,
                        inline: true,
                    },
                    {
                        name: "💾 | Dowload",
                        value: `[Click vào đây](${song.streamURL})`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${song.user}`,
                        inline: true,
                    },
                    {
                        name: "📻 | Play music at",
                        value: `
┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)}
┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
                        inline: false,
                    },
                    {
                        name: "🤖 | Suggestions",
                        value: `[${song.related[0].name}](${song.related[0].url})
┕⌛ | Time: ${song.related[0].formattedDuration} | 🆙 | Upload lên bởi: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`,
                        inline: false,
                    },
                ])
                .setImage(song.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    setTimeout(() => {
        msg.delete();
    }, 1000 * 60 * 2);
});

client.distube.on("empty", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
               
                .setDescription(
                    `🚫 | The room is empty, the bot automatically leaves the room!`
                ),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("error", async (channel, error) => {
    const msg = await channel.send({
        embeds: [
            new EmbedBuilder()
                
                .setDescription(
                    `🚫 | An error has occurred!\n\n** ${error
                        .toString()
                        .slice(0, 1974)}**`
                ),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("disconnect", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
            

                .setDescription(`🚫 | The bot has disconnected from the voice channel!`),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("finish", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
               
                .setDescription(
                    `🚫 | All songs on the playlist have been played!`
                ),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("initQueue", async (queue) => {
    queue.autoplay = true;
    queue.volume = 100;
});

client.distube.on("noRelated", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
              
                .setDescription(`🚫 | Song not found!`),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});
// .on("searchDone", () => {})
client.start();

// Handles errors and avoids crashes, better to not remove them.
process.env.YTSR_NO_UPDATE = "1";
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);