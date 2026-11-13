import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let client = null;
let transport = null;

export async function connectMcpServer(config = {}) {
  client = new Client({
    name: "automate-ai-client",
    version: "1.0.0",
  });

  transport = new StdioClientTransport({
    command: config.command || process.execPath,
    args: config.args || ["./mcp/server.js"],
  });

  await client.connect(transport);
  return client;
}

export async function getMcpTools() {
  if (!client) throw new Error("MCP client not connected");
  const result = await client.listTools();
  return result.tools || [];
}

export async function disconnectMcpServer() {
  if (client) {
    await client.close();
    client = null;
    transport = null;
  }
}