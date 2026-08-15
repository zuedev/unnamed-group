import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Events,
  PermissionFlagsBits,
  ChannelType,
  Routes,
} from "npm:discord.js@14.27.0";

import modules from "./modules/_index.js";

const discord = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
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
  // set the bot's presence to "Listening to my parents argue"
  discord.user.setPresence({
    activities: [
      {
        type: ActivityType.Listening,
        name: "my parents argue",
      },
    ],
  });

  // register commands
  await registerCommands(discord);

  // initialize modules
  for (const module of Object.values(modules)) {
    module(discord);
  }

  // log that the bot is ready
  console.log(
    `Bot is ready! Logged in as: ${discord.user.tag} (${discord.user.id})`,
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
      case "get-channel-permissions-bits":
        (async () => {
          const permissions = message.channel.permissionsFor(
            message.guild.roles.everyone,
          );
          if (!permissions) {
            await message.reply("Could not get permissions for this channel.");
            return;
          }
          await message.reply(
            `Permissions for this channel: ${permissions.bitfield}`,
          );
        })();
        break;
      case "set-channel-permissions-bits":
        (async () => {
          const permissionsToSetFromMessage = message.content
            .replace(`<@!${discord.user.id}> set-channel-permissions-bits`, "")
            .trim();
          const permissionsToSet = parseInt(permissionsToSetFromMessage);
          if (isNaN(permissionsToSet)) {
            await message.reply(
              "Please provide a valid number for the permissions to set.",
            );
            return;
          }
          await message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            {
              allow: permissionsToSet,
            },
          );
          await message.reply(
            `Set permissions for this channel to: ${permissionsToSet}`,
          );
        })();
        break;
      default:
        break;
    }
  }
});

discord.login(process.env.DISCORD_BOT_TOKEN);

async function registerCommands(discord) {
  const commands = {
    global: [],
    guild: [],
  };

  // register guild commands
  await discord.rest.put(
    Routes.applicationGuildCommands(
      discord.application.id,
      process.env.DISCORD_GUILD_ID,
    ),
    {
      body: commands.guild,
    },
  );

  // register global commands
  await discord.rest.put(Routes.applicationCommands(discord.application.id), {
    body: commands.global,
  });
}
