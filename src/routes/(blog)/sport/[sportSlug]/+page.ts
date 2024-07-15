import { getSportBySlug } from '$lib/services/sportService';
import type { PageLoad } from './$types';

export const prerender = true;
export const load: PageLoad = async ({ params }) => {
	const sport = await getSportBySlug(params.sportSlug);

	if (!sport) throw new Error('Unknown sport');

	return { sport };
};
