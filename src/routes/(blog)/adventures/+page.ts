import { getAdventuresDone } from '$lib/services/adventureService';

export const prerender = true;
export const load = async () => {
	const adventures = getAdventuresDone();
	return { adventures };
};
