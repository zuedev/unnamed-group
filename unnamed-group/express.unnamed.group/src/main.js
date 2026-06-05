import express from "express";
import { GameDig as GameDigLib } from "gamedig";
import servers from "./configuration/servers.js";

const app = express();

const GameDigOptions = {};
if (process.env.UDP_PORT) GameDigOptions.listenUdpPort = process.env.UDP_PORT;
const GameDig = new GameDigLib(GameDigOptions);

app.get("/", (request, response) => {
  response.redirect("/api");
});

app.get("/api", (request, response) => {
  response.json({ message: "Hello World!" });
});

app.get("/api/random", (request, response) => {
  response.json({ number: Math.random() });
});

app.get("/api/servers", async (request, response) => {
  const data = await getServers();
  response.json(data.filter(Boolean));
});

app.get("/api/servers.html", async (request, response) => {
  const data = await getServers();
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html {
        font-family: monospace;
        }
      </style>
    </head>
    <body>
      <h1>Unnamed Group Game Servers</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Game Name</th>
          <th>Server Name</th>
          <th>Status</th>
          <th>Players</th>
          <th>Max Players</th>
          <th>Host:Port</th>
          </tr>
        ${data
          .filter(Boolean)
          .map(
            (server) => `<tr>
              <td>${server.gameName}</td>
              <td>${server.serverName}</td>
              ${server.gamedig.output ? "<td style='background-color: #0f0;'>Online</td>" : "<td style='background-color: #f00;'>Offline</td>"}
              <td>${server.gamedig.output ? server.gamedig.output.players.length || server.gamedig.output.numplayers : 0}</td>
              <td>${server.gamedig.output ? server.gamedig.output.maxplayers : 0}</td>
              <td>${server.gamedig.input.host}:${server.gamedig.input.port}</td>
            </tr>`,
          )
          .join("")}
      </table>
    </body>
  </html>`;

  response.send(html);
});

app.listen(process.env.HTTP_PORT || 80, () => {
  console.log(
    `Server is running at: http://localhost:${process.env.HTTP_PORT || 80}`,
  );
});

async function getServers() {
  for (const server of servers) {
    try {
      const data = await GameDig.query({
        ...server.gamedig.input,
        maxRetries: 1,
      });
      server.gamedig.output = data;
    } catch (error) {
      console.error(`Error querying server ${server.serverName}:`, error);
      server.gamedig.output = null;
    }
  }

  return servers;
}
