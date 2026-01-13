import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create browser client - this is safe because this file is only imported in client components
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)


