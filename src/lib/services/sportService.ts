import config from '$lib/config';
import { AdventureStatus } from '$lib/constants';
import type { Adventure } from '$lib/types';

export const getAdventuresBySportSlug = async (sportSlug: string): Promise<Adventure[]> => {
	const res = await fetch(`${config.BASE_API_URL}/sports?slug=${sportSlug}`);
	const sports = await res.json();

	if (sports.length === 0) throw new Error('Unkown sport');

	return sports[0].adventures.filter((adventure) => adventure.status === AdventureStatus.DONE);
};
