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
        .addSubcommand((subcommand) =>
          subcommand
            .setName("uex_space_stations")
            .setDescription("Populates the uex_space_stations collection with data from the bot's UEX cache.")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("uex_points_of_interest")
            .setDescription("Populates the uex_points_of_interest collection with data from the bot's UEX cache.")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("inventory_locations")
            .setDescription("Populates the inventory_locations collection with data from the bot's UEX cache.")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("uex_vehicles")
            .setDescription("Populates the uex_vehicles collection with data from the bot's UEX cache.")
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
      switch (subcommand) {
        case "uex_items":
          populateUexItems(interaction);
          break;
        case "uex_space_stations":
          populateUexSpaceStations(interaction);
          break;
        case "uex_points_of_interest":
          populateUexPointsOfInterest(interaction);
          break;
        case "inventory_locations":
          populateInventoryLocations(interaction);
          break;
        case "uex_vehicles":
          populateUexVehicles(interaction);
          break;
      }
    }
  },
};

async function populateUexItems(interaction) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

  const items = uex.items ?? [];

  interaction.reply({
    content: `Populating uex_items collection with ${items.length} items...`,
    ephemeral: true,
  });

  let ops = 0;
  let failed = 0;
  let updates = 0;
  let creates = 0;

  for (const item of items) {
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
          content: `Populating uex_items collection with ${items.length} items... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Failed to create item ${item.name}:`, error);
      failed++;
    }
  }

  interaction.editReply({
    content: `Successfully populated uex_items collection with ${items.length} items. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
    ephemeral: true,
  });
}

async function populateUexSpaceStations(interaction) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

  const stations = uex.space_stations ?? [];

  interaction.reply({
    content: `Populating uex_space_stations collection with ${stations.length} stations...`,
    ephemeral: true,
  });

  let ops = 0;
  let failed = 0;
  let updates = 0;
  let creates = 0;

  for (const station of stations) {
    try {
      // does it already exist?
      const existingStation = await pb.collection("uex_space_stations").getFullList({
        filter: `id="${station.id}"`,
      });

      if (existingStation.length > 0) {
        // compare times to see if we need to update
        // example pocketbase: "2026-07-18 12:30:02.405Z"
        // example uex: 1746219762
        if (new Date(existingStation[0].updated).getTime() < station.updated * 1000) {
          await pb.collection("uex_space_stations").update(existingStation[0].id, {
            name: station.name,
          });
          updates++;
        }
      } else {
        await pb.collection("uex_space_stations").create({
          id: station.id,
          name: station.name,
        });
        creates++;
      }
      ops++;

      // update the interaction every 1000 operations to avoid timeout
      if (ops % 1000 === 0) {
        interaction.editReply({
          content: `Populating uex_space_stations collection with ${stations.length} stations... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Failed to create space station ${station.name}:`, error);
      failed++;
    }
  }

  interaction.editReply({
    content: `Successfully populated uex_space_stations collection with ${stations.length} stations. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
    ephemeral: true,
  });
}

async function populateUexPointsOfInterest(interaction) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

  const pointsOfInterest = uex.points_of_interest ?? [];

  interaction.reply({
    content: `Populating uex_points_of_interest collection with ${pointsOfInterest.length} points of interest...`,
    ephemeral: true,
  });

  let ops = 0;
  let failed = 0;
  let updates = 0;
  let creates = 0;

  for (const point of pointsOfInterest) {
    try {
      // does it already exist?
      const existingPoint = await pb.collection("uex_points_of_interest").getFullList({
        filter: `name="${point.name}"`,
      });

      if (existingPoint.length > 0) {
        await pb.collection("uex_points_of_interest").update(existingPoint[0].id, {
          name: point.name,
        });
        updates++;
      } else {
        await pb.collection("uex_points_of_interest").create({
          id: point.id,
          name: point.name,
        });
        creates++;
      }
      ops++;

      // update the interaction every 1000 operations to avoid timeout
      if (ops % 1000 === 0) {
        interaction.editReply({
          content: `Populating uex_points_of_interest collection with ${pointsOfInterest.length} points of interest... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Failed to create point of interest ${point.name}:`, error);
      failed++;
    }
  }

  interaction.editReply({
    content: `Successfully populated uex_points_of_interest collection with ${pointsOfInterest.length} points of interest. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
    ephemeral: true,
  });
}

async function populateInventoryLocations(interaction) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

  const stations = uex.space_stations ?? [];
  const pointsOfInterest = uex.points_of_interest ?? [];

  // merge + dedupe by name (case-insensitive)
  const locationMap = new Map();

  for (const station of stations) {
    if (!station?.name) continue;
    const key = station.name.trim().toLowerCase();
    locationMap.set(key, {
      id: station.id,
      name: station.name,
      updated: station.updated ?? 0,
    });
  }

  for (const point of pointsOfInterest) {
    if (!point?.name) continue;
    const key = point.name.trim().toLowerCase();
    const existing = locationMap.get(key);

    // keep whichever has the newest timestamp when duplicates exist
    if (!existing || (point.updated ?? 0) > (existing.updated ?? 0)) {
      locationMap.set(key, {
        id: point.id,
        name: point.name,
        updated: point.updated ?? 0,
      });
    }
  }

  const locations = Array.from(locationMap.values());

  interaction.reply({
    content: `Populating inventory_locations collection with ${locations.length} locations...`,
    ephemeral: true,
  });

  let ops = 0;
  let failed = 0;
  let updates = 0;
  let creates = 0;

  for (const location of locations) {
    try {
      const safeName = String(location.name).replaceAll('"', '\\"');

      const existingLocation = await pb.collection("inventory_locations").getFullList({
        filter: `name="${safeName}"`,
      });

      if (existingLocation.length > 0) {
        const pbUpdated = new Date(existingLocation[0].updated).getTime();
        const uexUpdated = (location.updated ?? 0) * 1000;

        if (pbUpdated < uexUpdated) {
          await pb.collection("inventory_locations").update(existingLocation[0].name, {
            name: location.name,
          });
          updates++;
        }
      } else {
        await pb.collection("inventory_locations").create({
          name: location.name,
        });
        creates++;
      }

      ops++;

      if (ops % 1000 === 0) {
        interaction.editReply({
          content: `Populating inventory_locations collection with ${locations.length} locations... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Failed to create inventory location ${location?.name}:`, error);
      failed++;
    }
  }

  interaction.editReply({
    content: `Successfully populated inventory_locations collection with ${locations.length} locations. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
    ephemeral: true,
  });
}

async function populateUexVehicles(interaction) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  pb.authStore.save(process.env.POCKETBASE_AUTH_TOKEN, null);

  const vehicles = uex.vehicles ?? [];

  interaction.reply({
    content: `Populating uex_vehicles collection with ${vehicles.length} vehicles...`,
    ephemeral: true,
  });

  let ops = 0;
  let failed = 0;
  let updates = 0;
  let creates = 0;

  for (const vehicle of vehicles) {
    try {
      const existingVehicle = await pb.collection("uex_vehicles").getFullList({
        filter: `id="${vehicle.id}"`,
      });

      if (existingVehicle.length > 0) {
        const pbUpdated = new Date(existingVehicle[0].updated).getTime();
        const uexUpdated = (vehicle.updated ?? 0) * 1000;

        if (pbUpdated < uexUpdated) {
          await pb.collection("uex_vehicles").update(existingVehicle[0].id, {
            name: vehicle.name,
          });
          updates++;
        }
      } else {
        await pb.collection("uex_vehicles").create({
          id: vehicle.id,
          name: vehicle.name,
        });
        creates++;
      }

      ops++;

      if (ops % 1000 === 0) {
        interaction.editReply({
          content: `Populating uex_vehicles collection with ${vehicles.length} vehicles... (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Failed to create vehicle ${vehicle?.name}:`, error);
      failed++;
    }
  }

  interaction.editReply({
    content: `Successfully populated uex_vehicles collection with ${vehicles.length} vehicles. (${ops} processed, ${updates} updated, ${creates} created, ${failed} failed)`,
    ephemeral: true,
  });
}