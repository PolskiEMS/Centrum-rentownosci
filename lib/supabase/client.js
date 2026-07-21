import { createClient } from "@supabase/supabase-js";

let browserClient;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Brak zmiennych NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  browserClient = createClient(url, publishableKey);
  return browserClient;
}
