import { SlashCommandBuilder } from "discord.js";
import createTicket from "../utilities/createTicket.js";
import notifyRoleByName from "../utilities/notifyRoleByName.js";

export default {
  data: new SlashCommandBuilder()
    .setName("requisition")
    .setDescription(
      "Request items from the quartermaster. A new requisition ticket will be created.",
    )
    .addStringOption((option) =>
      option
        .setName("contents")
        .setDescription("What are you requesting? Be as specific as possible.")
        .setRequired(true),
    ),
  execute: async (interaction) => {
    const contents = interaction.options.getString("contents");

    const ticket = await createTicket(interaction, {
      roleNamesWithAccess: ["quartermaster"],
      ticketNamePrefix: "req-",
    });

    await ticket.send({
      content: `**New requisition request from <@${interaction.user.id}>**: ${contents}`,
    });

    // reply to the user
    await interaction.reply({
      content: `Your requisition ticket has been created: <#${ticket.id}>`,
      ephemeral: true,
    });

    // notify quartermasters
    await notifyRoleByName(
      interaction.guild,
      "quartermaster",
      `New requisition request from <@${interaction.user.id}>: ${contents}`,
    );
  },
};
