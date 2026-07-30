/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  output: "standalone",

  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/RGgSfVj4DD",
        permanent: true,
      },
      {
        source: "/handbook",
        destination: "https://handbook.174bg.net",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "https://handbook.174bg.net",
        permanent: true,
      },
      {
        source: "/manager",
        destination: "https://manager.174bg.net",
        permanent: true,
      },
      {
        source: "/login",
        destination: "https://manager.174bg.net",
        permanent: true,
      },
      {
        source: "/database",
        destination: "https://db.174bg.net",
        permanent: true,
      },
      {
        source: "/db",
        destination: "https://db.174bg.net",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
