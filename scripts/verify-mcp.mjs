import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function send(proc, message) {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
}

function readResponse(proc, expectedId) {
  return new Promise((resolvePromise, reject) => {
    let buffer = "";

    const onData = (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const parsed = JSON.parse(line);
          if (parsed.id === expectedId) {
            proc.stdout.off("data", onData);
            resolvePromise(parsed);
            return;
          }
        } catch {
          // Ignore non-JSON stdout.
        }
      }
    };

    proc.stdout.on("data", onData);
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`MCP server exited with code ${code}`));
      }
    });

    setTimeout(() => {
      proc.stdout.off("data", onData);
      reject(new Error("Timed out waiting for MCP response"));
    }, 10_000);
  });
}

const proc = spawn("npm", ["run", "mcp"], {
  cwd: projectRoot,
  stdio: ["pipe", "pipe", "pipe"],
  shell: true,
});

proc.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

send(proc, {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "verify-mcp", version: "0.1.0" },
  },
});

const initResponse = await readResponse(proc, 1);
if (initResponse.error) {
  throw new Error(`initialize failed: ${JSON.stringify(initResponse.error)}`);
}

send(proc, { jsonrpc: "2.0", method: "notifications/initialized" });

send(proc, {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
  params: {},
});

const toolsResponse = await readResponse(proc, 2);
if (toolsResponse.error) {
  throw new Error(`tools/list failed: ${JSON.stringify(toolsResponse.error)}`);
}

const tools = toolsResponse.result?.tools ?? [];
const toolNames = tools.map((tool) => tool.name);

if (!toolNames.includes("generate_component")) {
  throw new Error(
    `Expected generate_component tool, got: ${toolNames.join(", ") || "(none)"}`,
  );
}

console.log("MCP server OK — tools:", toolNames.join(", "));

proc.kill();
process.exit(0);
