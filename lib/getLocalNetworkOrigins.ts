import os from "node:os";

export function getLocalNetworkOrigins(): string[] {
  const origins = new Set<string>();

  for (const iface of Object.values(os.networkInterfaces())) {
    if (!iface) continue;

    for (const addr of iface) {
      if (addr.family === "IPv4" && !addr.internal) {
        origins.add(addr.address);
      }
    }
  }

  return [...origins];
}
