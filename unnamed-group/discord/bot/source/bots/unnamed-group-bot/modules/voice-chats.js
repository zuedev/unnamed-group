import {
  Events,
  ChannelType,
  PermissionFlagsBits,
} from "npm:discord.js@14.27.0";

export function voiceChats(discord) {
  setInterval(() => {
    discord.guilds.cache.forEach(
      (guild) =>
        guild.id === process.env.DISCORD_GUILD_ID &&
        guild.channels.cache
          .filter(
            (channel) =>
              channel.type === ChannelType.GuildVoice &&
              channel.name.endsWith("'s Voice Channel") &&
              channel.members.size === 0,
          )
          .forEach((channel) => channel.delete()),
    );
  }, 10 * 1000);

  discord.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    // ignore events from other guilds not specified in the .env file
    if (newState.guild.id !== process.env.DISCORD_GUILD_ID) return;

    // has the user joined the "create voice channel" voice channel?
    if (newState.channel?.name === "create voice channel") {
      // does the user already have a voice channel?
      if (
        !newState.guild.channels.cache.some((channel) => {
          return (
            channel.type === ChannelType.GuildVoice &&
            channel.name === `${newState.member.user.username}'s Voice Channel`
          );
        })
      ) {
        const guild = newState.guild;
        const newChannel = await guild.channels.create({
          name: `${newState.member.user.username}'s Voice Channel`,
          type: ChannelType.GuildVoice,
          parent: newState.channel.parentId,
        });
      }

      // get the id of the new (or not new) voice channel
      const voiceChannelId = newState.guild.channels.cache.find((channel) => {
        return (
          channel.type === ChannelType.GuildVoice &&
          channel.name === `${newState.member.user.username}'s Voice Channel`
        );
      });

      // move the user to the new voice channel
      await newState.member.voice.setChannel(voiceChannelId);
    }
  });
}
