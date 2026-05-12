/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // generate a minimal, production-ready Docker image with only the required runtime files and dependencies
  output: "standalone",
};

export default nextConfig;
