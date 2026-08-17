import("./bots/_index.js").then((m) => {
  const disabledBots = process.env.DISABLED_BOTS?.split(",") || [];

  for (const bot of Object.values(m.default))
    if (!disabledBots.includes(bot.name)) bot();
});

import("./webpanel.js").then((m) => m.default());
