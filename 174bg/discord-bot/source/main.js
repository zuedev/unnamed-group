import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

import commands from "./commands/_index.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  await registerCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.guild.id !== process.env.DISCORD_GUILD_ID) return;

  if (interaction.isChatInputCommand()) {
    if (
      commands.some((command) => command.data.name === interaction.commandName)
    ) {
      const command = commands.find(
        (command) => command.data.name === interaction.commandName,
      );
      await command.execute(interaction);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN,
  );

  // clear global commands
  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
    body: [],
  });

  // register guild-scoped commands
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID,
      process.env.DISCORD_GUILD_ID,
    ),
    {
      body: commands.map((command) => command.data.toJSON()),
    },
  );
}