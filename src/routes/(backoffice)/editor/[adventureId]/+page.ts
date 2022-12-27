import { getAdventureById } from '$lib/services/adventureService';
import type { PageLoad } from './$types';

export const ssr = false;
export const load: PageLoad = async ({ params: { adventureId } }) => {
	const adventure = await getAdventureById(adventureId);
	return { adventure, adventureId };
};
