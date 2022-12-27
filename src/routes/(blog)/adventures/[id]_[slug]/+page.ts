import { getAdventureById } from '$lib/services/adventureService';
import type { PageLoad } from './$types';

export const prerender = true;
export const load: PageLoad = async ({ params }) => {
	const adventure = await getAdventureById(params.id);
	return { adventure };
};
