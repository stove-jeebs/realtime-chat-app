import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
