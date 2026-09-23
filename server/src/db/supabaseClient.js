import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://cuijbyfmtzulznxkpwgq.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_rHmzx-eVF0HuqP9P_nUJHg_E7jngZPA';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

