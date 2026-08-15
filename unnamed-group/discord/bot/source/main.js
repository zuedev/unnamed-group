import bots from "./bots/_index.js";

const disabledBots = process.env.DISABLED_BOTS?.split(",") || [];

for (const bot of Object.values(bots)) {
  if (disabledBots.includes(bot.name)) continue;

  bot();
}
