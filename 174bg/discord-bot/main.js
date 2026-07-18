import fs from "fs";
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
import getUrl from "./utilities/getUrl.js";
import commands from "./commands/_index.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  await registerCommands();

  await buildCache();
});

client.on(Events.InteractionCreate, async (interaction) => {
  // only respond to interactions in the specified guild
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
  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN,
    );

    // clear global commands
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: [],
    });

    console.log("Cleared global application commands.");

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

    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);

    await guild.members.fetch();

    console.log(
      `Successfully registered application commands for guild ${process.env.DISCORD_GUILD_ID} (${guild ? guild.name : "Unknown"}).`,
    );
  } catch (error) {
    console.error(error);
  }
}

async function buildCache() {
  if (!fs.existsSync("./.cache")) fs.mkdirSync("./.cache");

  const uex = {};
  
  uex.categories = (await getUrl("https://api.uexcorp.uk/2.0/categories"))?.data;

  for (const category of uex.categories) {
    uex.items = uex.items || [];
    if (category.type === "item") {
      uex.items = uex.items.concat((await getUrl(`https://api.uexcorp.uk/2.0/items?id_category=${category.id}`))?.data || []);
    }
  }

  uex.space_stations = (await getUrl("https://api.uexcorp.uk/2.0/space_stations"))?.data;
  uex.cities = (await getUrl("https://api.uexcorp.uk/2.0/cities"))?.data;
  uex.outposts = (await getUrl("https://api.uexcorp.uk/2.0/outposts"))?.data;
  uex.points_of_interest = (await getUrl("https://api.uexcorp.uk/2.0/poi"))?.data;
  uex.terminals = (await getUrl("https://api.uexcorp.uk/2.0/terminals"))?.data;
  uex.vehicles = (await getUrl("https://api.uexcorp.uk/2.0/vehicles"))?.data;
  uex.vehicles_pledge_prices = (await getUrl("https://api.uexcorp.uk/2.0/vehicles_prices"))?.data;
  uex.vehicles_buy_prices = (await getUrl("https://api.uexcorp.uk/2.0/vehicles_purchases_prices"))?.data;
  uex.vehicles_rent_prices = (await getUrl("https://api.uexcorp.uk/2.0/vehicles_rentals_prices"))?.data;

  // is there a difference between the current cache and the new cache?
  if (fs.existsSync("./.cache/uex.json")) {
    const currentCache = JSON.parse(fs.readFileSync("./.cache/uex.json", "utf-8"));

    if (JSON.stringify(currentCache) === JSON.stringify(uex)) {
      console.log("No changes detected in UEX cache.");
      console.log("If you want to force a cache update, delete the .cache/uex.json file and restart the bot.");
      for (const [key, value] of Object.entries(uex)) {
        console.log(`Found ${value.length} ${key.replace(/_/g, " ")}.`);
      }
      return;
    }

    console.log("Changes detected in UEX cache. Updating cache.");

    // backup the current cache YYMMDDHHMMSS
    fs.writeFileSync(
      `./.cache/uex.json.bak.${new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "")}`,
      JSON.stringify(currentCache, null, 2),
    );
  } else {
    console.log("No existing UEX cache found. Creating new cache.");
  }

  await fs.writeFileSync(
    "./.cache/uex.json",
    JSON.stringify(uex, null, 2),
  );

  for (const [key, value] of Object.entries(uex)) {
    console.log(`Cached ${value.length} ${key.replace(/_/g, " ")}.`);
  }
}