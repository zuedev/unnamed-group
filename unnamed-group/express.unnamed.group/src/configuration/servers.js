let servers = [
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
    gameName: "Minecraft",
    serverName: "All the Mods 10",
    gamedig: {
      input: {
        type: "minecraft",
        host: "178.63.67.58",
        port: 25565,
      },
    },
  },
  {
    gameName: "Satisfactory",
    serverName: "Public",
    gamedig: {
      input: {
        type: "satisfactory",
        host: "178.63.67.58",
        port: 7777,
      },
    },
  },
  {
    gameName: "Arma Reforger",
    serverName: "Co-op Recon Missions Everon",
    gamedig: {
      input: {
        type: "armareforger",
        host: "178.63.67.58",
        port: 17777,
      },
    },
  },
  {
    gameName: "Arma Reforger",
    serverName: "Co-op Freedom Fighters Plus Everon",
    gamedig: {
      input: {
        type: "armareforger",
        host: "178.63.67.58",
        port: 17787,
      },
    },
  },
  {
    gameName: "Arma Reforger",
    serverName: "Co-op IPC Kunar PVE US",
    gamedig: {
      input: {
        type: "armareforger",
        host: "178.63.67.58",
        port: 17797,
      },
    },
  },
  {
    gameName: "Arma Reforger",
    serverName: "Co-op Just In Time",
    gamedig: {
      input: {
        type: "armareforger",
        host: "178.63.67.58",
        port: 17807,
      },
    },
  },
  {
    gameName: "Arma Reforger",
    serverName: "Co-op Escapists Everon",
    gamedig: {
      input: {
        type: "armareforger",
        host: "178.63.67.58",
        port: 17817,
      },
    },
  },
  {
    gameName: "Factorio",
    serverName: "Whitelisted Default Preset",
    gamedig: {
      input: {
        type: "factorio",
        host: "178.63.67.58",
        port: 34197,
      },
    },
  },
  {
    gameName: "Factorio",
    serverName: "Public Death World Marathon",
    gamedig: {
      input: {
        type: "factorio",
        host: "178.63.67.58",
        port: 34198,
      },
    },
  },
];

// Sort servers by game name
servers = servers.sort((a, b) => {
  if (a.gameName < b.gameName) {
    return -1;
  }
  if (a.gameName > b.gameName) {
    return 1;
  }
  return 0;
});

export default servers;
