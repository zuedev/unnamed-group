import {
  Events,
  ChannelType,
  PermissionFlagsBits,
} from "npm:discord.js@14.27.0";
import { Buffer } from "node:buffer";

export function logs(discord) {
  discord.on(Events.MessageCreate, onMessageCreate);
  discord.on(Events.MessageDelete, onMessageDelete);
  discord.on(Events.MessageReactionAdd, onMessageReactionAdd);
  discord.on(Events.MessageReactionRemove, onMessageReactionRemove);
  discord.on(Events.MessageReactionRemoveAll, onMessageReactionRemoveAll);
}

async function onMessageCreate(message) {
  try {
    if (!message.author.bot) {
      await log(message.guild, {
        content: "Events.MessageCreate",
        files: [
          {
            name: `message.json`,
            attachment: Buffer.from(JSON.stringify(message, null, 2), "utf-8"),
          },
        ],
      });
    }
  } catch (error) {
    console.error(`[ERROR] Events.MessageCreate: ${error.message}`);
  }
}

async function onMessageDelete(message) {
  try {
    await log(message.guild, {
      content: "Events.MessageDelete",
      files: [
        {
          name: "message.json",
          attachment: Buffer.from(JSON.stringify(message, null, 2), "utf-8"),
        },
      ],
    });
  } catch (error) {
    console.error(`[ERROR] Events.MessageDelete: ${error.message}`);
  }
}

async function onMessageReactionAdd(messageReaction, user, details) {
  try {
    await log(messageReaction.message.guild, {
      content: "Events.MessageReactionAdd",
      files: [
        {
          name: `messageReaction.json`,
          attachment: Buffer.from(
            JSON.stringify(messageReaction, null, 2),
            "utf-8",
          ),
        },
        {
          name: `user.json`,
          attachment: Buffer.from(JSON.stringify(user, null, 2), "utf-8"),
        },
        {
          name: `details.json`,
          attachment: Buffer.from(JSON.stringify(details, null, 2), "utf-8"),
        },
      ],
    });
  } catch (error) {
    console.error(`[ERROR] Events.MessageReactionAdd: ${error.message}`);
  }
}

async function onMessageReactionRemove(messageReaction, user, details) {
  try {
    await log(messageReaction.message.guild, {
      content: "Events.MessageReactionRemove",
      files: [
        {
          name: `messageReaction.json`,
          attachment: Buffer.from(
            JSON.stringify(messageReaction, null, 2),
            "utf-8",
          ),
        },
        {
          name: `user.json`,
          attachment: Buffer.from(JSON.stringify(user, null, 2), "utf-8"),
        },
        {
          name: `details.json`,
          attachment: Buffer.from(JSON.stringify(details, null, 2), "utf-8"),
        },
      ],
    });
  } catch (error) {
    console.error(`[ERROR] Events.MessageReactionRemove: ${error.message}`);
  }
}

async function onMessageReactionRemoveAll(message, reactions) {
  try {
    await log(message.guild, {
      content: "Events.MessageReactionRemoveAll",
      files: [
        {
          name: `message.json`,
          attachment: Buffer.from(JSON.stringify(message, null, 2), "utf-8"),
        },
        {
          name: `reactions.json`,
          attachment: Buffer.from(JSON.stringify(reactions, null, 2), "utf-8"),
        },
      ],
    });
  } catch (error) {
    console.error(`[ERROR] Events.MessageReactionRemoveAll: ${error.message}`);
  }
}

async function log(guild, message) {
  let logChannel = guild.channels.cache.find(
    (channel) =>
      channel.name === "logs" && channel.type === ChannelType.GuildText,
  );

  if (!logChannel)
    logChannel = await guild.channels.create({
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
    });

  await logChannel.send(message);
}
