export function logoUpdate(discord) {
  setInterval(
    async () => {
      const logoUrls = [
        "https://github.com/zuedev/unnamed-group/blob/master/unnamed-group/discord/assets/images/logo/official.png?raw=true",
        ...[
          "153172054856826880.png",
          "723361818940276736.png",
          "247625024779845632.png",
          "313128528558161920.png",
        ].map(
          (filename) =>
            `https://github.com/zuedev/unnamed-group/blob/master/unnamed-group/discord/assets/images/logo/member-logos/${filename}?raw=true`,
        ),
      ];

      const randomLogoUrl =
        logoUrls[Math.floor(Math.random() * logoUrls.length)];

      const guild = await discord.guilds.fetch(process.env.DISCORD_GUILD_ID);
      await guild.setIcon(randomLogoUrl, "bot logo update");
    },
    1000 * 60 * 10, // every 10 minutes
  );
}
