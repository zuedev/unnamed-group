import {
  Events,
  GatewayDispatchEvents,
  ChannelType,
  PermissionFlagsBits,
} from "npm:discord.js@14.27.0";
import { Buffer } from "node:buffer";

const LOGGED_EVENTS = new Set([
  GatewayDispatchEvents.MessageCreate,
  GatewayDispatchEvents.MessageDelete,
  GatewayDispatchEvents.MessageReactionAdd,
  GatewayDispatchEvents.MessageReactionRemove,
  GatewayDispatchEvents.MessageReactionRemoveAll,
]);

export function logs(discord) {
  discord.on(Events.Raw, (packet) => onRaw(discord, packet));
}

async function onRaw(discord, packet) {
  try {
    if (!LOGGED_EVENTS.has(packet.t)) return;
    if (packet.d?.guild_id !== process.env.DISCORD_GUILD_ID) return;

    if (
      packet.t === GatewayDispatchEvents.MessageCreate &&
      packet.d.author?.bot
    )
      return;

    const files = [
      {
        name: `${packet.t}.json`,
        attachment: Buffer.from(JSON.stringify(packet.d, null, 2), "utf-8"),
      },
    ];

    // raw fires before discord.js processes the packet, so on MESSAGE_DELETE the message (with content) is still cached; the raw payload only carries IDs
    if (packet.t === GatewayDispatchEvents.MessageDelete) {
      const cachedMessage = discord.channels.cache
        .get(packet.d.channel_id)
        ?.messages?.cache.get(packet.d.id);

      if (cachedMessage)
        files.push({
          name: "cachedMessage.json",
          attachment: Buffer.from(
            JSON.stringify(cachedMessage, null, 2),
            "utf-8",
          ),
        });
    }

    const guild = discord.guilds.cache.get(packet.d.guild_id);
    if (!guild) return;

    await log(guild, { content: `Events.Raw: ${packet.t}`, files });
  } catch (error) {
    try {
      const guild = discord.guilds.cache.get(process.env.DISCORD_GUILD_ID);
      if (!guild) return;

      await log(guild, {
        content: `Error in logs module: ${error.message}`,
        files: [
          {
            name: "error.json",
            attachment: Buffer.from(JSON.stringify(error, null, 2), "utf-8"),
          },
        ],
      });
    } catch (error) {
      console.error("Error logging error in logs module:", error);
    }
  }
}

const pendingLogChannels = new Map();

async function log(guild, message) {
  let logChannel = guild.channels.cache.find(
    (channel) =>
      channel.name === "logs" && channel.type === ChannelType.GuildText,
  );

  if (!logChannel) {
    // memoize creation so concurrent events can't create duplicate channels
    if (!pendingLogChannels.has(guild.id))
      pendingLogChannels.set(
        guild.id,
        guild.channels
          .create({
            name: "logs",
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: guild.client.user.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          })
          .finally(() => pendingLogChannels.delete(guild.id)),
      );

    logChannel = await pendingLogChannels.get(guild.id);
  }

  await logChannel.send(message);
}
