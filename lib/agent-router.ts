import { ChatOpenAI } from "@langchain/openai"; // Using standard LangChain interfaces
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { getVectorStore } from "./vector-store";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Defining the router orchestrator
export class AgentRouter {
  // Select LLM Based on environment
  private getModel() {
    // If we want to strictly use HuggingFace inference text generation, 
    // we would use HuggingFaceEndpoint or ChatHuggingFace. 
    // Because AI Studio has Gemini built-in, we use it as the fallback/primary orchestration brain
    // while Hugging Face runs embeddings, or we try to use HF if specified.
    
    // For robust JSON parsing/routing, Gemini/OpenAI are preferred over raw HF pipelines,
    // but we can integrate raw HF if strictly defined.
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-2.5-pro",
      temperature: 0.1, // Low temp for routing
    });
  }

  async run(messages: any[]) {
    const llm = this.getModel();
    
    // Convert Vercel messages to Langchain messages
    const lcMessages = messages.map(m => {
      if (m.role === "user") return new HumanMessage(m.content);
      if (m.role === "system") return new SystemMessage(m.content);
      return new AIMessage(m.content);
    });

    const lastMessage = lcMessages[lcMessages.length - 1];
    
    // Advanced Query Capability: Search persistent memory
    let memoryContext = "";
    try {
      // Safe guard Supabase fetch in case table isn't set up
      const vectorStore = await getVectorStore();
      const results = await vectorStore.similaritySearch(lastMessage.content as string, 3);
      if (results && results.length > 0) {
        memoryContext = `\n\nPersistent Memory Context:\n${results.map(r => r.pageContent).join("\n")}`;
      }
    } catch (e) {
      console.warn("[Router] Vector memory search bypassed/failed. Is Supabase pgvector configured?", e);
    }

    // Agent Router Logic
    // E.g., Deployer, Search, General Conversation
    const systemPromptText = `You are the central orchestrator (Agent Router). 
Your backend is connected to a Supabase vector store, MCP remote servers, and an integration bus.
Use the persistent memory context if relevant to the user's query.${memoryContext}`;

    // Add our system message orchestrator logic
    const messagesWithContext = [
      new SystemMessage(systemPromptText),
      ...lcMessages
    ];

    // Build the streaming chain
    const chain = RunnableSequence.from([
      llm,
      new StringOutputParser()
    ]);

    // Stream out the response
    return chain.stream(messagesWithContext);
  }
}

export const agentRouter = new AgentRouter();
