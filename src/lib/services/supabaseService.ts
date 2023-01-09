import config from '$lib/config';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
	const { SUPABASE } = config;
	return createClient(SUPABASE.URL, SUPABASE.API_KEY);
};
