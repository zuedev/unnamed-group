import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Events,
  PermissionFlagsBits,
  ChannelType,
  Routes,
} from "discord.js";

const discord = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: [Partials.Message],
  presence: {
    activities: [
      {
        type: ActivityType.Watching,
        name: "my boot sequence",
      },
    ],
  },
});

discord.on(Events.ClientReady, async () => {
  discord.user.setPresence({
    activities: [
      {
        type: ActivityType.Listening,
        name: "my parents argue",
      },
    ],
  });

  // every 10 seconds...
  setInterval(() => {
    // find empty user-created voice channels and delete them
    discord.guilds.cache.forEach((guild) => {
      guild.channels.cache.forEach((channel) => {
        if (
          channel.type === ChannelType.GuildVoice &&
          channel.name.endsWith("'s Voice Channel") &&
          channel.members.size === 0
        ) {
          console.log(
            `Deleting empty voice channel: ${channel.name} in guild: ${guild.name}`
          );
          channel.delete().catch(console.error);
        }
      });
    });
  }, 10 * 1000);

  const commands = {
    global: [],
    guild: [],
  };

  // register guild commands
  await discord.rest.put(
    Routes.applicationGuildCommands(
      discord.application.id,
      process.env.DISCORD_GUILD_ID
    ),
    {
      body: commands.guild,
    }
  );

  // register global commands
  await discord.rest.put(Routes.applicationCommands(discord.application.id), {
    body: commands.global,
  });

  console.log(
    `Bot is ready! Logged in as: ${discord.user.tag} (${discord.user.id})`
  );
});

discord.on(Events.MessageCreate, async (message) => {
  // ignore messages from bots
  if (message.author.bot) return;

  // ignore messages not in the specified guild
  if (message.guild.id !== process.env.DISCORD_GUILD_ID) return;

  if (message.content.startsWith(`<@!${discord.user.id}>`)) {
    let command = message.content.replace(`<@!${discord.user.id}>`, "").trim();

    switch (command) {
      case "purge-members-without-roles":
        // user should have administrator permissions to run this command
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
          message.reply("You do not have permission to run this command.");
          return;
        }

        let deletedCount = 0;

        await message.guild.members.fetch();

        message.guild.members.cache.forEach(async (member) => {
          if (member.user.bot) return; // ignore bots
          if (member.roles.cache.size === 1) {
            // only has the @everyone role
            try {
              await member.kick("Purged for not having a role");
              deletedCount++;
            } catch (error) {
              console.error(`Failed to kick member ${member.id}:`, error);
            }
          }
        });
        
        message.channel.send(
          `Purged ${deletedCount} members without roles.`
        );
        break;
      default:
        break;
    }
  }
});

discord.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  // ignore events from other guilds not specified in the .env file
  if (newState.guild.id !== process.env.DISCORD_GUILD_ID) return;

  console.log(`Voice state updated:`, {
    user: {
      id: newState.member.id,
      username: newState.member.user.username,
      discriminator: newState.member.user.discriminator,
    },
    oldChannel: {
      id: oldState.channelId,
      name: oldState.channel?.name,
    },
    newChannel: {
      id: newState.channelId,
      name: newState.channel?.name,
    },
  });

  // has the user joined the "create voice channel" voice channel?
  if (newState.channel?.name === "create voice channel") {
    console.log(
      `User ${newState.member.user.username} has joined the "create voice channel" voice channel. Creating a new voice channel...`
    );

    // does the user already have a voice channel?
    if (
      newState.guild.channels.cache.some((channel) => {
        return (
          channel.type === ChannelType.GuildVoice &&
          channel.name === `${newState.member.user.username}'s Voice Channel`
        );
      })
    ) {
      console.log(
        `User ${newState.member.user.username} already has a voice channel. Not creating a new one.`
      );
    } else {
      console.log(
        `User ${newState.member.user.username} does not have a voice channel. Creating a new one.`
      );

      const guild = newState.guild;
      const newChannel = await guild.channels.create({
        name: `${newState.member.user.username}'s Voice Channel`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parentId, // use the same parent as the "create voice channel" channel
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
          },
        ],
      });

      console.log(`Created new voice channel: ${newChannel.name}`);
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

    console.log(
      `Moved user ${newState.member.user.username} to their voice channel.`
    );
  }
});

discord.login(process.env.DISCORD_BOT_TOKEN);
