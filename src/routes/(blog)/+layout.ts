import { getAllSports } from '$lib/services/sportService';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const load: LayoutLoad = () => {
	const sports = getAllSports();

	return { sports };
};
