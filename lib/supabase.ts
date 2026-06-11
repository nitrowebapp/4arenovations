import { createClient } from "@supabase/supabase-js";

// Server-only client with the secret (service role) key — never import in client components
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY não configurados no .env");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export const GALLERY_BUCKET = "gallery";
