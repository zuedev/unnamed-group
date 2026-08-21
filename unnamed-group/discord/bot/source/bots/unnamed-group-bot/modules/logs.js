import {
  Events,
  GatewayDispatchEvents,
  ChannelType,
  PermissionFlagsBits,
} from "npm:discord.js@14.27.0";
import { Buffer } from "node:buffer";

// these events carry the guild id as d.id rather than d.guild_id
const GUILD_OBJECT_EVENTS = new Set([
  GatewayDispatchEvents.GuildCreate,
  GatewayDispatchEvents.GuildUpdate,
  GatewayDispatchEvents.GuildDelete,
]);

// too chatty to log; would drown the channel and back up the rate-limited send queue
const IGNORED_EVENTS = new Set([
  GatewayDispatchEvents.PresenceUpdate,
  GatewayDispatchEvents.TypingStart,
]);

export function logs(discord) {
  discord.on(Events.Raw, (packet) => onRaw(discord, packet));
}

async function onRaw(discord, packet) {
  try {
    if (IGNORED_EVENTS.has(packet.t)) return;

    const guildId =
      packet.d?.guild_id ??
      (GUILD_OBJECT_EVENTS.has(packet.t) ? packet.d?.id : undefined);
    if (guildId !== process.env.DISCORD_GUILD_ID) return;

    // our own log posts emit MESSAGE_CREATE; skipping bot messages breaks the loop
    if (
      packet.t === GatewayDispatchEvents.MessageCreate &&
      packet.d.author?.bot
    )
      return;

    const documents = [
      { name: packet.t, json: JSON.stringify(packet.d, null, 2) },
    ];
    let summarySource = packet.d;

    // raw fires before discord.js processes the packet, so on MESSAGE_DELETE the message (with content) is still cached; the raw payload only carries IDs
    if (packet.t === GatewayDispatchEvents.MessageDelete) {
      const cachedMessage = discord.channels.cache
        .get(packet.d.channel_id)
        ?.messages?.cache.get(packet.d.id);

      if (cachedMessage) {
        documents.push({
          name: "cachedMessage",
          json: JSON.stringify(cachedMessage, null, 2),
        });
        summarySource = {
          ...packet.d,
          content: cachedMessage.content,
          author: cachedMessage.author && {
            id: cachedMessage.author.id,
            username: cachedMessage.author.username,
          },
        };
      }
    }

    const guild = discord.guilds.cache.get(guildId);
    if (!guild) return;

    await log(
      guild,
      buildLogMessage(`Events.Raw: ${packet.t}`, documents, summarySource),
    );
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

const MAX_MESSAGE_CONTENT_LENGTH = 2000;

// inline JSON so Discord search indexes it; attachments are only a fallback
function buildLogMessage(header, documents, summarySource) {
  const inline = [
    header,
    ...documents.map(
      ({ name, json }) => `**${name}**\n\`\`\`json\n${json}\n\`\`\``,
    ),
  ].join("\n");

  // payloads containing ``` would escape the code fence, so ship those as files
  const fenceSafe = documents.every(({ json }) => !json.includes("```"));

  if (fenceSafe && inline.length <= MAX_MESSAGE_CONTENT_LENGTH)
    return { content: inline };

  let content = [header, summarize(summarySource)].filter(Boolean).join("\n");
  if (content.length > MAX_MESSAGE_CONTENT_LENGTH)
    content = `${content.slice(0, MAX_MESSAGE_CONTENT_LENGTH - 1)}…`;

  return {
    content,
    files: documents.map(({ name, json }) => ({
      name: `${name}.json`,
      attachment: Buffer.from(json, "utf-8"),
    })),
  };
}

// key facts kept searchable when the full payload has to go into attachments
function summarize(data) {
  const user =
    data.author ??
    data.member?.user ??
    (data.user_id ? { id: data.user_id } : undefined);

  const fields = {
    id: data.id ?? data.message_id,
    channel_id: data.channel_id,
    author: user && (user.username ? `${user.username} (${user.id})` : user.id),
    emoji:
      data.emoji &&
      (data.emoji.id
        ? `${data.emoji.name} (${data.emoji.id})`
        : data.emoji.name),
    content: data.content,
  };

  return Object.entries(fields)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
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

  // reposted user content must never ping
  await logChannel.send({ ...message, allowedMentions: { parse: [] } });
}
