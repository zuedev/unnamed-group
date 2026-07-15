import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

const commands = [
  {
    data: new SlashCommandBuilder()
      .setName("scope")
      .setDescription("Returns the current scope of the bot."),
    execute: async (interaction) => {
      await interaction.reply(codewrap("json", JSON.stringify({
        guildIdFromEnv: process.env.DISCORD_GUILD_ID,
        guildIdFromInteraction: interaction.guild.id,
        doGuildIdsMatch:
          process.env.DISCORD_GUILD_ID === interaction.guild.id,
      }, null, 2)));
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName("create-requisition-ticket")
      .setDescription(
        "Creates a requisition ticket for the quartermaster to review.",
      )
      .addStringOption((option) =>
        option
          .setName("contents")
          .setDescription(
            "What are you requesting? Be as specific as possible.",
          )
          .setRequired(true),
      ),
    execute: async (interaction) => {
      // extract options
      const [contents] = [interaction.options.getString("contents")];

      // get "tickets" category
      const ticketsCategory = interaction.guild.channels.cache.find(
        (channel) =>
          channel.name.toLowerCase() === "tickets" && channel.type === 4,
      );

      if (!ticketsCategory)
        return await interaction.reply("Tickets category not found.");

      // get the quartermaster role id
      let quartermasterRole = interaction.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "quartermaster",
      );

      if (!quartermasterRole)
      {
        // no qm role? make it
        const newRole = await interaction.guild.roles.create({
          name: "Quartermaster",
          color: "Blue",
        });

        quartermasterRole = newRole;
      }

      // create a new text channel under the "tickets" category with the following format:
      // req-<timestamp_short>
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:.T]/g, "")
        .slice(2, 16); // YYMMDDHHMMSS
      const channelName = `req-${timestamp}`;

      const newChannel = await interaction.guild.channels.create({
        name: channelName,
        type: 0, // text channel
        parent: ticketsCategory.id,
        // set permissions so that only the user who created the ticket and the quartermaster role can view it
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: quartermasterRole.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ],
      });

      // send a normal message to the new channel with a close button that only the quartermaster role can see
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_req_ticket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(false),
      );

      await newChannel.send({
        content: `**Requisition Ticket #${timestamp}**\n**Contents:** ${contents}\n**Created by:** <@${interaction.user.id}>`,
        components: [row],
      });

      // reply to the user
      await interaction.reply({
        content: `Your requisition ticket has been created: <#${newChannel.id}>`,
        ephemeral: true,
      });

      // log
      sendMessageToLogsChannel(
        `Requisition ticket <#${newChannel.id}> created by <@${interaction.user.id}>`,
      );

      // notify all members with the quartermaster role if it exists
      // (member cache is kept up to date via the GuildMembers intent, so no
      // need to re-fetch all members here)
      const quartermasterMembers = quartermasterRole.members;
      for (const member of quartermasterMembers.values()) {
        await member.send(
          `A new requisition ticket has been created: <#${newChannel.id}>`,
        );
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName("delete-all-requisition-tickets")
      .setDescription("Deletes all requisition tickets.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
      // get "tickets" category
      const ticketsCategory = interaction.guild.channels.cache.find(
        (channel) =>
          channel.name.toLowerCase() === "tickets" && channel.type === 4,
      );

      if (!ticketsCategory)
        return await interaction.reply("Tickets category not found.");

      // get all channels under the "tickets" category that start with "req-"
      const requisitionTickets = ticketsCategory.children.cache.filter(
        (channel) => channel.name.startsWith("req-"),
      );

      // delete all requisition tickets
      for (const ticket of requisitionTickets.values()) {
        await ticket.delete();
      }

      // log
      sendMessageToLogsChannel(
        `<@${interaction.user.id}> used \`/delete-all-requisition-tickets\` and deleted **${requisitionTickets.size}** requisition tickets.`,
      );
    },
  },
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

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
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {
      body: commands.map((command) => command.data.toJSON()),
    });

    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);

    // fetch all members once so the cache stays populated; the GuildMembers
    // intent keeps it in sync afterward via gateway events, avoiding repeated
    // opcode 8 (Request Guild Members) calls that can get rate limited
    await guild.members.fetch();

    console.log(`Successfully registered application commands for guild ${process.env.DISCORD_GUILD_ID} (${guild ? guild.name : "Unknown"}).`);
  } catch (error) {
    console.error(error);
  }
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

  if (interaction.isButton()) {
    if (interaction.customId === "close_req_ticket") {
      // get the quartermaster role id
      const quartermasterRole = interaction.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "quartermaster",
      );

      if (!quartermasterRole)
        return await interaction.reply("Quartermaster role not found.");

      // check if the user has the quartermaster role or is an administrator
      if (
        !interaction.member.roles.cache.has(quartermasterRole.id) &&
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return await interaction.reply({
          content: "You do not have permission to close this ticket.",
          ephemeral: true,
        });
      }

      // fetch all messages in the channel
      const messages = await interaction.channel.messages.fetch();

      // capture channel info before it's deleted (and removed from cache)
      const channelId = interaction.channel.id;
      const channelName = interaction.channel.name;

      // delete the channel
      await interaction.channel.delete();

      // log
      sendMessageToLogsChannel({
        content: `<#${channelId}> closed by <@${interaction.user.id}>`,
        files: [
          {
            name: `${channelName}.txt`,
            attachment: Buffer.from(
              messages
                .map(
                  (message) =>
                    `${message.author.tag}/${message.author.id}: ${message.content}`,
                )
                .reverse()
                .join("\n"),
            ),
          },
        ],
      });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

function sendMessageToLogsChannel(message) {
  const logsChannel = client.channels.cache.find(
    (channel) => channel.guild.id === process.env.DISCORD_GUILD_ID && channel.name === "logs" && channel.type === 0,
  );

  if (!logsChannel) return console.error("Logs channel not found.");

  logsChannel.send(message);
}

function codewrap(language, content) {
  return "```" + language + "\n" + content + "\n```";
}