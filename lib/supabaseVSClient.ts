import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase
const embeddings = new OpenAIEmbeddings();
export const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
export const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents", queryName: "match_documents"
});

export const vectorStoreGames = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents_games", queryName: "match_documents_games"
});


