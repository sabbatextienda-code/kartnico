import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bvnwcyzqdbyvaqxptzko.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bndjeXpxZGJ5dmFxeHB0emtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMTEyMDAsImV4cCI6MjAyMDExMTIwMH0.dummy_signature'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
