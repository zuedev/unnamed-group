import { ChannelType, PermissionFlagsBits } from "discord.js";

export default async (
  interaction,
  options = { roleNamesWithAccess: [], ticketNamePrefix: "ticket-" },
) => {
  const ticketsCategory = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name.toLowerCase() === "tickets" &&
      channel.type === ChannelType.GuildCategory,
  );

  if (!ticketsCategory)
    return await interaction.reply("Tickets category not found.");

  // get the roles that should have access to this ticket
  const rolesWithAccess = options.roleNamesWithAccess.map((roleName) => {
    return interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === roleName.toLowerCase(),
    );
  });

  // create a new text channel under the "tickets" category with the following format: ticket-<timestamp_short>
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, "")
    .slice(2, 16);

  const channelName = `${options.ticketNamePrefix}${timestamp}`;

  const newChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: ticketsCategory.id,
    // set permissions so that only the user who created the ticket and the roles with access can view it
    permissionOverwrites: [
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
      ...rolesWithAccess.map((role) => ({
        id: role.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      })),
    ],
  });

  return newChannel;
};
