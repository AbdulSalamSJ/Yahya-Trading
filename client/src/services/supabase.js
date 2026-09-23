import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cuijbyfmtzulznxkpwgq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rHmzx-eVF0HuqP9P_nUJHg_E7jngZPA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

