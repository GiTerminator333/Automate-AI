import { MCPAdapter } from "@langchain/mcp-adapters";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, "server.js");

const mcpAdapter = new MCPAdapter({
  servers: {
    automate: {
      transport: "stdio",
      command: process.execPath,
      args: [serverPath],
    },
  },
});

let cachedTools = null;

export async function getMCPTools() {
  if (cachedTools) {
    return cachedTools;
  }

  cachedTools = await mcpAdapter.listTools();

  console.log(
    "Loaded MCP tools:",
    cachedTools.map((tool) => tool.name)
  );

  return cachedTools;
}

export async function closeMCPAdapter() {
  cachedTools = null;
  await mcpAdapter.close();
}