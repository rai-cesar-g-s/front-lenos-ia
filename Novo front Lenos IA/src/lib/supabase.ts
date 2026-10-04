import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lhkfkswrftqhzkwhohst.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_GIXDwkkwqD2Dh1t2C8hUfA_Qf_6_7YW';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
