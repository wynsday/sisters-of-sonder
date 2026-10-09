import type { NextConfig } from "next";

// The main address. Every other domain the Sisters own forwards here.
const MAIN = "https://sosonder.org";
const FORWARDED = [
  "www.sosonder.org",
  "sosonder.app",
  "www.sosonder.app",
  "sistersofsonder.org",
  "www.sistersofsonder.org",
  "sistersofsonder.com",
  "www.sistersofsonder.com",
  "sistersofsonder.app",
  "www.sistersofsonder.app",
  "sistersofsonder.dev",
  "www.sistersofsonder.dev",
];

const nextConfig: NextConfig = {
  async redirects() {
    return FORWARDED.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${MAIN}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
