// lib/supabase/client.js
// Use this inside Client Components and hooks (browser-side)
import { createBrowserClient } from '@supabase/ssr'
 
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
