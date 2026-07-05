# 174BG Discord Bot

This repository contains the source code for the official Discord bot for the 174th Battle Group community. The bot is written in JavaScript using the [discord.js](https://discord.js.org) library.

## Features

- `/create-requisition-ticket` — Creates a private ticket channel under the **tickets** category so a member can submit a request to the Quartermaster role.
- `/delete-all-requisition-tickets` — Bulk-deletes all open requisition tickets. Restricted to administrators.
- Logs ticket activity (creation and closure) to a **logs** channel.

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```
   DISCORD_CLIENT_ID=
   DISCORD_BOT_TOKEN=
   ```

3. Run the bot:

   ```sh
   npm start
   ```

   During development, use `npm run dev` (or `npm run dev:watch` to restart on file changes) to load the `.env` file automatically.

## Deployment

A `Dockerfile` is provided to build and run the bot in a container:

```sh
docker build -t 174bg-discord-bot .
docker run --env-file .env 174bg-discord-bot
```
