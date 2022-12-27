import { getAdventureById } from '$lib/services/adventureService';
import type { PageLoad } from './$types';

export const ssr = false;
export const load: PageLoad = async ({ params }) => {
	const adventure = await getAdventureById(Number(params.adventureId));
	return { adventure };
};
