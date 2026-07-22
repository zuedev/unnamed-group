import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { items } from "../controllers/uex.js";

export default {
    data: new SlashCommandBuilder()
        .setName("uex")
        .setDescription(
            "Commands for interacting with UEX.",
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("lookup")
                .setDescription("Lookup UEX information.")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("items")
                        .setDescription("Perform UEX lookup for Star Citizen items, including ship components, weapons, and more.")
                        .addStringOption((option) =>
                            option
                                .setName("query")
                                .setDescription(
                                    "The item name or partial name to search for.",
                                )
                                .setRequired(true),
                        ),
                )
        ),
    execute: async (interaction) => {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        switch (subcommandGroup) {
            case "lookup":
                switch (subcommand) {
                    case "items":
                        await uex_lookup_items(interaction);
                        break;
                    default:
                        await interaction.reply({
                            content: "Unknown subcommand.",
                            ephemeral: true,
                        });
                        break;
                }
                break;
            default:
                await interaction.reply({
                    content: "Unknown subcommand group.",
                    ephemeral: true,
                });
                break;
        }
    },
};

async function uex_lookup_items(interaction) {
    const query = interaction.options.getString("query");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const allItems = await items();

    const matchingItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (matchingItems.length === 0) {
        await interaction.editReply({
            content: `No items found matching "${query}".`,
        });
        return;
    }

    const itemList = matchingItems
        .map((item) => `- ${item.name} (ID: ${item.id})`)
        .join("\n");

    await interaction.editReply({
        content: `Found ${matchingItems.length} item(s) matching "${query}":\n${itemList}`,
    });
}