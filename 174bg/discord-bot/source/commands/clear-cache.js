import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import fs from "fs";

export default {
  data: new SlashCommandBuilder()
    .setName("clear-cache")
    .setDescription("Clears the bot's cache.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const cacheDir = ".cache";

    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      await interaction.reply({
        content: "Cache cleared successfully.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "Cache directory does not exist.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
