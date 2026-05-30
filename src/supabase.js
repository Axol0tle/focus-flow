import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkfdoeoplrtijbursfcd.supabase.com';
const supabaseKey = 'sb_publishable_6jCBgulUby93nS1gvFJ5lg_wepCuShC';

export const supabase = createClient(supabaseUrl, supabaseKey);