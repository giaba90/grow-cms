import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ⚠️ necessario per Docker production build
  reactStrictMode: true,
  swcMinify: true,
  // altre opzioni opzionali:
  // experimental: {
  //   serverActions: true
  // },
};

export default nextConfig;
