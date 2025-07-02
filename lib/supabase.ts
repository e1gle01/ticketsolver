import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://micvumnzwilphssmmbdq.supabase.co'; // 🔁 replace this
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3Z1bW56d2lscGhzc21tYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5ODE2MjAsImV4cCI6MjA2NjU1NzYyMH0.pcF-cep2w1MJ2C0yJ4tdQJP2r732E9Qc3u5RiGBJQxA'; // 🔁 replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
