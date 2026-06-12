import type { NextConfig } from "next";

import { getLocalNetworkOrigins } from "./lib/getLocalNetworkOrigins";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@cursor/sdk"],
  // Allow phones/tablets on the LAN to load dev assets when using the Network URL.
  allowedDevOrigins: getLocalNetworkOrigins(),
};

export default nextConfig;
