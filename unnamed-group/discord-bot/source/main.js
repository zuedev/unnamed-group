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
