import { newAdventure } from '$lib/data/generators/adventure';
import { getAdventureById } from '$lib/services/adventureService';
import type { Adventure } from '$lib/types';
import type { PageLoad } from './$types';

export const ssr = false;
export const load: PageLoad = async ({ params: { adventureId } }) => {
	let adventure: Adventure;
	try {
		adventure = await getAdventureById(adventureId);
	} catch {
		adventure = newAdventure(adventureId);
	}
	return { adventure, adventureId };
};
