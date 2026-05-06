import { createClient } from "@supabase/supabase-js";

// We use the service role key on the backend to bypass RLS for vector similarity search, 
// OR user anon key if configured carefully with RLS. 
// For this demo, we assume a standard setup.
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  
  return createClient(supabaseUrl, supabaseKey);
};
