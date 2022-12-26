import { getLatestAdventures } from '$lib/services/adventureService';
import { getAllSports } from '$lib/services/sportService';
import { getHomepageCover } from '$lib/services/coverPictureService';
import type { PageLoad } from './$types';

export const prerender = true;
export const load: PageLoad = async () => {
	const latestAdventures = await getLatestAdventures();
	const sports = getAllSports();

	return { latestAdventures, coverPicture: getHomepageCover(), sports };
};
