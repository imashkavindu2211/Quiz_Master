
import { getSupabaseAdmin } from '../src/lib/supabase-admin';

async function checkSchema() {
  const { data, error } = await getSupabaseAdmin().from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Available columns in profiles:', Object.keys(data[0]));
  } else {
    console.log('Profiles table is empty, trying to get columns via another way...');
    // We can't easily get column names if empty without a more complex query, 
    // but maybe we can try to insert a dummy row and see the error? No.
  }
}

checkSchema();
