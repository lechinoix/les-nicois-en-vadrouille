import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';
import { createSupabaseGraphQLClient } from './graphql';

const supabaseUrl = 'https://mxhdhwaoueiiehyajavu.supabase.co';
const anonSupabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const publicSupabase = createClient<Database>(supabaseUrl, anonSupabaseKey);
export const graphqlClient = createSupabaseGraphQLClient();
