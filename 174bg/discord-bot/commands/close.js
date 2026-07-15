import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription(
      "Closes the current ticket by logging the contents and deleting the channel.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const channel = interaction.channel;

    if (!channel || !channel.name.startsWith("ticket-")) {
      return await interaction.reply({
        content: "This command can only be used in a ticket channel.",
        ephemeral: true,
      });
    }

    // log the contents of the ticket and send to the logs channel if it exists
    const messages = await channel.messages.fetch({ limit: 100 });
    const log = messages
      .map((message) => `${message.author.tag}: ${message.content}`)
      .reverse()
      .join("\n");

    console.log(`Ticket log for ${channel.name}:\n${log}`);

    const logsChannel = interaction.guild.channels.cache.find(
      (ch) => ch.name === "logs" && ch.isTextBased(),
    );

    if (logsChannel)
      await logsChannel.send({
        content: `# Ticket log for ${channel.name}`,
        files: [
          {
            name: `${channel.name}.txt`,
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

    // delete the channel
    await channel.delete();
  },
};
