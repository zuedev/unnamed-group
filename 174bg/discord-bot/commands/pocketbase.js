import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import PocketBase from "pocketbase";
import uex from "../.cache/uex.json" with { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("pocketbase")
    .setDescription("Runs various PocketBase commands.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((group) =>
      group
        .setName("populate")
        .setDescription("Populates the PocketBase database with data.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("uex_items")
            .setDescription("Populates the uex_items collection with data from the bot's UEX cache.")
        )
    ),
  execute: async (interaction) => {
    // only zuedev can run any of these commands
    if (interaction.member.id !== "723361818940276736") return interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });

    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === "populate") {
      if (subcommand === "uex_items") {
        const pb = new PocketBase(process.env.POCKETBASE_URL);
        pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

        interaction.reply({
          content: `Populating uex_items collection with ${uex.items.length} items...`,
          ephemeral: true,
        });

        let ops = 0;
        let failed = 0;
        let updates = 0;
        let creates = 0;

        for (const item of uex.items) {
          try {
            // does it already exist?
            const existingItem = await pb.collection("uex_items").getFullList({
              filter: `id="${item.id}"`,
            });

            if (existingItem.length > 0) {
              // compare times to see if we need to update
              // example pocketbase: "2026-07-18 12:30:02.405Z"
              // example uex: 1746219762
              if (new Date(existingItem[0].updated).getTime() < item.updated * 1000) {
                await pb.collection("uex_items").update(existingItem[0].id, {
                  name: item.name,
                });
                updates++;
              }
            } else {
              await pb.collection("uex_items").create({
                id: item.id,
                name: item.name,
              });
              creates++;
            }
            ops++;

            // update the interaction every 1000 operations to avoid timeout
            if (ops % 1000 === 0) {
              interaction.editReply({
                content: `Populating uex_items collection with ${uex.items.length} items... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
                ephemeral: true,
              });
            }
          } catch (error) {
            console.error(`Failed to create item ${item.name}:`, error);
            failed++;
          }
        }

        interaction.editReply({
          content: `Successfully populated uex_items collection with ${uex.items.length} items. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    }
  },
};
