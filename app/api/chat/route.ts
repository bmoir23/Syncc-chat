import { LangChainAdapter } from "@ai-sdk/langchain";
import { agentRouter } from "@/lib/agent-router";

export const maxDuration = 60; // Max execution duration in seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The router returns a Langchain string stream
    const stream = await agentRouter.run(messages);

    // LangChainAdapter bridges LangChain's stream to Vercel AI SDK's DataStreamResponse
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e: any) {
    console.error("[Chat API Error]", e);
    return new Response(JSON.stringify({ error: e.message || "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
