import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://odeitcsvjrkvwomqvdzz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZWl0Y3N2anJrdndvbXF2ZHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTU0NDMsImV4cCI6MjA4NzgzMTQ0M30.1Ai6zlXLLLC0CQXUCtfSrE1KYPH03Tb6IXq1xKBnyi4'

export const supabase = createClient(supabaseUrl, supabaseKey)
