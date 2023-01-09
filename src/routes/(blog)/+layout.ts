import { getAllSports } from '$lib/services/sportService';
import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const prerender = true;
export const load: LayoutLoad = async (event) => {
	const sports = getAllSports();
	const { session } = await getSupabase(event);

	return { sports, session };
};
