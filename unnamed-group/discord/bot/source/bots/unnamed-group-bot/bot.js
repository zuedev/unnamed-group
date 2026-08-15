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

export function UnnamedGroupBot() {
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
      const disabledModuleNames =
        process.env.DISABLED_MODULES?.split(",") || [];

      if (disabledModuleNames.includes(module.name)) continue;

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

    if (message.content.startsWith(`<@${discord.user.id}>`)) {
      let fragments = message.content.trim().split(" ");
      let prefix = fragments[0];
      let command = fragments[1];
      let args = fragments.slice(2);

      const messageCommands = {
        ping: async () => {
          await message.reply("Pong!");
        },
        debug: async () => {
          let debugJson = {
            _: {
              fragments,
              prefix,
              command,
              args,
            },
            discord: {
              message: {
                id: message.id,
                content: message.content,
              },
            },
          };

          await message.reply({
            content: "Debug info:",
            files: [
              {
                name: "debug.json",
                attachment: Buffer.from(
                  JSON.stringify(debugJson, null, 2),
                  "utf-8",
                ),
              },
            ],
          });
        },
      };

      if (messageCommands[command]) await messageCommands[command]();
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
}
