import { ChannelType, PermissionFlagsBits } from "discord.js";

/**
 * Creates a new ticket channel under the "tickets" category with the specified options.
 *
 * @param {Interaction} interaction The interaction object from Discord.js.
 * @param {Object} options The options for creating the ticket.
 * @param {Array<string>} options.roleNamesWithAccess The names of the roles that should have access to the ticket.
 * @param {string} options.ticketNamePrefix The prefix for the ticket channel name.
 *
 * @returns {Promise<Channel>} The newly created ticket channel.
 */
export default async function createTicket(
  interaction,
  options = { roleNamesWithAccess: [], ticketNamePrefix: "ticket-" },
) {
  const ticketsCategory = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name.toLowerCase() === "tickets" &&
      channel.type === ChannelType.GuildCategory,
  );

  if (!ticketsCategory)
    throw new Error("Tickets category not found in the guild.");

  const rolesWithAccess = options.roleNamesWithAccess.map((roleName) => {
    return interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === roleName.toLowerCase(),
    );
  });

  const timestamp = Date.now().toString(36); // base36

  const newChannel = await interaction.guild.channels.create({
    name: `${options.ticketNamePrefix}-${timestamp}`,
    type: ChannelType.GuildText,
    parent: ticketsCategory.id,
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
}
