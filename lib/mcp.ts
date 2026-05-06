import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// This is a placeholder for MCP (Model Context Protocol) integration.
// It allows defining remote servers that provide contextual tools and resources.
export class McpConnector {
  private clients: Map<string, Client> = new Map();

  async connectToServer(name: string, url: string) {
    if (this.clients.has(name)) return this.clients.get(name);

    if (!url) {
      console.warn(`[MCP] Missing URL for server ${name}`);
      return null;
    }

    try {
      const transport = new SSEClientTransport(new URL(url));
      const client = new Client(
        {
          name: "AgentCore-Client",
          version: "1.0.0",
        },
        {
          capabilities: { tools: {} },
        }
      );

      await client.connect(transport);
      this.clients.set(name, client);
      return client;
    } catch (e) {
      console.error(`[MCP] Failed to connect to server ${name}:`, e);
      return null;
    }
  }

  async discoverTools(serverName: string) {
    const client = this.clients.get(serverName);
    if (!client) return [];
    
    // Fallback/stub for discovering tools from the MCP server
    try {
      const { tools } = await client.listTools();
      return tools;
    } catch (e) {
      console.error(`[MCP] Discovery error:`, e);
      return [];
    }
  }
}

export const mcpConnector = new McpConnector();
