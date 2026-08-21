import {
  Events,
  GatewayDispatchEvents,
  ChannelType,
  PermissionFlagsBits,
} from "npm:discord.js@14.27.0";
import { Buffer } from "node:buffer";

const IGNORED_EVENTS = new Set([
  // too chatty to log
  GatewayDispatchEvents.PresenceUpdate,
  GatewayDispatchEvents.TypingStart,
  GatewayDispatchEvents.VoiceChannelEffectSend,
  // not relevant
  GatewayDispatchEvents.GuildCreate,
  GatewayDispatchEvents.GuildDelete,
  GatewayDispatchEvents.GuildAuditLogEntryCreate,
  // gateway plumbing: fetch responses and reconnect syncs, not user actions
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayDispatchEvents.SoundboardSounds,
  GatewayDispatchEvents.ThreadListSync,
  // payloads carry live tokens that must not be reposted
  GatewayDispatchEvents.InteractionCreate,
  GatewayDispatchEvents.VoiceServerUpdate,
]);

const MAX_MESSAGE_CONTENT_LENGTH = 2000;

export function logs(discord) {
  // scoped per bot instance instead of module-level, so state can't leak across clients
  const pendingLogChannels = new Map();

  async function log(guild, message) {
    let logChannel = guild.channels.cache.find(
      (channel) =>
        channel.name === "logs" && channel.type === ChannelType.GuildText,
    );

    if (!logChannel) {
      // memoize creation so concurrent events can't create duplicate channels
      if (!pendingLogChannels.has(guild.id)) {
        pendingLogChannels.set(
          guild.id,
          guild.channels
            .create({
              name: "logs",
              type: ChannelType.GuildText,
              permissionOverwrites: [
                {
                  id: guild.roles.everyone.id,
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
      }

      logChannel = await pendingLogChannels.get(guild.id);
    }

    // reposted user content must never ping
    await logChannel.send({ ...message, allowedMentions: { parse: [] } });
  }

  discord.on(Events.Raw, async (packet) => {
    try {
      if (IGNORED_EVENTS.has(packet.t)) return;

      // GUILD_UPDATE carries the guild id as d.id rather than d.process.env.DISCORD_GUILD_ID
      const guildId =
        packet.d?.process.env.DISCORD_GUILD_ID ??
        (packet.t === GatewayDispatchEvents.GuildUpdate
          ? packet.d?.id
          : undefined);
      if (guildId !== process.env.DISCORD_GUILD_ID) return;

      const guild = discord.guilds.cache.get(guildId);
      if (!guild) return;

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

      // inline JSON so Discord search indexes it; attachments are only a fallback
      const inline = [
        packet.t,
        ...documents.map(
          ({ name, json }) => `**${name}**\n\`\`\`json\n${json}\n\`\`\``,
        ),
      ].join("\n");

      // payloads containing ``` would escape the code fence, so ship those as files
      const fenceSafe = documents.every(({ json }) => !json.includes("```"));

      if (fenceSafe && inline.length <= MAX_MESSAGE_CONTENT_LENGTH)
        return await log(guild, { content: inline });

      // key facts kept searchable when the full payload has to go into attachments
      const user =
        summarySource.author ??
        summarySource.member?.user ??
        (summarySource.user_id ? { id: summarySource.user_id } : undefined);

      const fields = {
        id: summarySource.id ?? summarySource.message_id,
        channel_id: summarySource.channel_id,
        author:
          user && (user.username ? `${user.username} (${user.id})` : user.id),
        emoji:
          summarySource.emoji &&
          (summarySource.emoji.id
            ? `${summarySource.emoji.name} (${summarySource.emoji.id})`
            : summarySource.emoji.name),
        content: summarySource.content,
      };

      const summary = Object.entries(fields)
        .filter(([, value]) => value != null && value !== "")
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      let content = [packet.t, summary].filter(Boolean).join("\n");
      // code-point slice so truncation can't split a surrogate pair
      if (content.length > MAX_MESSAGE_CONTENT_LENGTH)
        content = `${[...content]
          .slice(0, MAX_MESSAGE_CONTENT_LENGTH - 1)
          .join("")}…`;

      await log(guild, {
        content,
        files: documents.map(({ name, json }) => ({
          name: `${name}.json`,
          attachment: Buffer.from(json, "utf-8"),
        })),
      });
    } catch (error) {
      try {
        const guild = discord.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        if (!guild) return;

        // JSON.stringify on an Error yields {}; stack carries the real detail
        const details = error.stack ?? String(error);
        await log(guild, {
          content: `Error in logs module: ${details}`.slice(
            0,
            MAX_MESSAGE_CONTENT_LENGTH,
          ),
        });
      } catch (logError) {
        console.error("Error logging error in logs module:", logError);
      }
    }
  });
}
