import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { z } from "zod";

import { generateComponent } from "../lib/generateComponent.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(projectRoot, ".env.local") });

const server = new McpServer({
  name: "component-builder",
  version: "0.1.0",
});

server.registerTool(
  "generate_component",
  {
    title: "Generate React Component",
    description:
      "Generate a self-contained React + Tailwind CSS component from a natural-language description. Returns TypeScript source code.",
    inputSchema: {
      prompt: z
        .string()
        .min(1)
        .describe(
          "Description of the UI component to build (e.g. 'a pricing card with three tiers')",
        ),
    },
  },
  async ({ prompt }) => {
    const result = await generateComponent(prompt);

    if (!result.ok) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: result.error,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: result.code,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`component-builder MCP server failed: ${message}\n`);
  process.exit(1);
});
