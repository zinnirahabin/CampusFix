import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxixggzulzmlmhhvrbyg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXhnZ3p1bHptbG1oaHZyYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNjAwNzUsImV4cCI6MjExMDYzNjA3NX0.dVocwIBWuuvETJsay2QAioVeCbTO6Y8fZ0ojl28e2ZM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
