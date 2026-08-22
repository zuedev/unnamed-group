import { GameDig as GameDigLib } from "npm:gamedig@5.3.2";

const GameDig = new GameDigLib();

const servers = [
  {
    gameName: "Nuclear Option",
    serverName: "Escalation Co-op as BDF",
    gamedig: {
      input: {
        type: "protocol-valve",
        host: "178.63.67.58",
        port: 7012,
      },
    },
  },
  {
    gameName: "Nuclear Option",
    serverName: "Escalation Co-op as PALA",
    gamedig: {
      input: {
        type: "protocol-valve",
        host: "178.63.67.58",
        port: 7022,
      },
    },
  },
  {
    gameName: "Nuclear Option",
    serverName: "Terminal Control Co-op as BDF",
    gamedig: {
      input: {
        type: "protocol-valve",
        host: "178.63.67.58",
        port: 7032,
      },
    },
  },
  {
    gameName: "Nuclear Option",
    serverName: "Terminal Control Co-op as PALA",
    gamedig: {
      input: {
        type: "protocol-valve",
        host: "178.63.67.58",
        port: 7042,
      },
    },
  },
  {
    gameName: "Nuclear Option",
    serverName: "Fleet Warfare Co-op as BDF",
    gamedig: {
      input: {
        type: "protocol-valve",
        host: "178.63.67.58",
        port: 7052,
      },
    },
  },
  {
    gameName: "Palworld",
    serverName: "Palworld",
    portOverride: 8211,
    gamedig: {
      input: {
        type: "palworld",
        host: "178.63.67.58",
        port: 8212,
        username: "admin",
        password: "lemonroot",
      },
    },
  },
];

Deno.serve(
  { port: Number(Deno.env.get("HTTP_PORT") || 80), hostname: "0.0.0.0" },
  async (request) => {
    const { pathname, searchParams } = new URL(request.url);

    switch (pathname) {
      case "/api/servers":
        if (searchParams.has("search")) {
          const searchQuery = searchParams.get("search").toLowerCase();
          const filteredServers = servers.filter((server) =>
            server.serverName.toLowerCase().includes(searchQuery),
          );
          return new Response(JSON.stringify(filteredServers), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify(servers), {
            headers: { "Content-Type": "application/json" },
          });
        }
      case "/api/servers/gamedig":
        const serverName = searchParams.get("serverName");
        const server = servers.find((s) => s.serverName === serverName);
        if (server) {
          try {
            const state = await GameDig.query(server.gamedig.input);
            return new Response(JSON.stringify(state), {
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        } else {
          return new Response(JSON.stringify({ error: "Server not found" }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      case "/docs":
        return new Response(
          `
        <html>
          <head>
            <title>Server API</title>
          </head>
          <body>
            <h1>Server API</h1>
            <p>Use the following endpoints:</p>
            <ul>
              <li><a href="/api/servers">/api/servers</a> - Get all servers</li>
              <li><a href="/api/servers?search=Escalation">/api/servers?search=Escalation</a> - Search servers by name</li>
              <li><a href="/api/servers/gamedig?serverName=Escalation Co-op as BDF">/api/servers/gamedig?serverName=Escalation Co-op as BDF</a> - Get server state using GameDig</li>
            </ul>
          </body>
        </html>
        `,
          { headers: { "Content-Type": "text/html" } },
        );
      default:
        return new Response(
          `
        <html>
          <head>
            <title>Unnamed Group Servers</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

              body {
                font-family: 'Inter';
              }

              table {
                width: 100%;
                border-collapse: collapse;
              }

              th, td {
                padding: 8px;
                text-align: left;
              }

              th {
                background-color: black;
                color: white;
                border: 1px solid black;
              }

              tr:nth-child(even) {
                background-color: lightgray;
              }

              tr:hover {
                background-color: darkgray;
              }
            </style>
          </head>
          <body>
            <h1>Unnamed Group Servers</h1>
            <table id="server-list" border="1" cellpadding="5" cellspacing="0">
              <thead>
                <tr>
                  <th>Game Name</th>
                  <th>Server Name</th>
                  <th>Status</th>
                  <th>Players</th>
                  <th>Max Players</th>
                  <th>Host:Port</th>
                </tr>
              </thead>
              <tbody>
                ${servers
                  .map((server) => {
                    return `
                      <tr>
                        <td>${server.gameName}</td>
                        <td>${server.serverName}</td>
                        <td id="status-${server.serverName}">Loading...</td>
                        <td id="players-${server.serverName}">Loading...</td>
                        <td id="maxPlayers-${server.serverName}">Loading...</td>
                        <td>${server.gamedig.input.host}${server.portOverride ? ":" + server.portOverride : server.gamedig.input.port ? ":" + server.gamedig.input.port : ""}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
            <script>
              async function fetchServerState(serverName) {
                const response = await fetch(\`/api/servers/gamedig?serverName=\${encodeURIComponent(serverName)}\`);
                const data = await response.json();
                const statusCell = document.getElementById(\`status-\${serverName}\`);
                if (data.error) {
                  statusCell.textContent = 'Offline';
                  statusCell.style.backgroundColor = '#f00';
                  document.getElementById(\`players-\${serverName}\`).textContent = 'N/A';
                  document.getElementById(\`maxPlayers-\${serverName}\`).textContent = 'N/A';
                } else {
                  // absence of an error means the query succeeded, i.e. the server is online
                  statusCell.textContent = 'Online';
                  statusCell.style.backgroundColor = '#0f0';
                  document.getElementById(\`players-\${serverName}\`).textContent = data.players?.length ?? data.numplayers ?? 0;
                  document.getElementById(\`maxPlayers-\${serverName}\`).textContent = data.maxplayers ?? 'N/A';
                }
              }

              ${servers
                .map((server) => {
                  return `fetchServerState("${server.serverName}");`;
                })
                .join("")}
            </script>
          </body>
        </html>
        `,
          { headers: { "Content-Type": "text/html" } },
        );
    }
  },
);
