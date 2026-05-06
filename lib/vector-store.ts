import { getSupabaseClient } from "./supabase";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

// Initialize the Embeddings model using Hugging Face
export const getEmbeddings = () => {
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY || "placeholder-hf-key",
  });
};

// Initialize the Vector Store for persistent memory
// Note: You must have a 'documents' table in Supabase set up with pgvector.
export const getVectorStore = async () => {
  const client = getSupabaseClient();
  const embeddings = getEmbeddings();
  
  return new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });
};
