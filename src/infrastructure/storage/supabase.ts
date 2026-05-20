import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Always use service_role for server operations to bypass RLS and let our app's tenant guard handle isolation
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are missing (URL or Service Role Key).')
}

export const supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export const BUCKET_NAME = process.env.SUPABASE_BUCKET ?? 'undangandigital'
