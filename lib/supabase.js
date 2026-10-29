import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.STORAGE_URL ||
    ""
  );
}

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.STORAGE_ANON_KEY ||
    ""
  );
}

function getSupabaseServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.STORAGE_SERVICE_ROLE_KEY ||
    ""
  );
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey() || getSupabaseAnonKey();
  return Boolean(url && key);
}

let adminClient = null;
let publicClient = null;

/**
 * Returns an authenticated Supabase client for backend operations.
 * Prefers the service_role/secret key to bypass Row-Level Security for admin API operations.
 */
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (adminClient) return adminClient;

  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey() || getSupabaseAnonKey();

  adminClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}

/**
 * Returns a public anon Supabase client.
 */
export function getSupabasePublic() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (publicClient) return publicClient;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey() || getSupabaseServiceKey();

  publicClient = createClient(url, key);
  return publicClient;
}
