import { createClient } from '@supabase/supabase-js'

// Public client for server-side queries that don't require auth.
// This uses the anon key and works regardless of whether the user is logged in.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
