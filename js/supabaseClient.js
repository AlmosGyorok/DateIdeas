// js/supabaseClient.js
export const SUPABASE_URL = "https://efgcpyemybfdwevnthrg.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_P8lgO3fRdhhbI-2LcGgMHA_or4m0a4O";

export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
