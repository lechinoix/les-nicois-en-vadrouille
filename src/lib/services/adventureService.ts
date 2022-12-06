import config from '$lib/config';
import type { Adventure, AdventureData, Picture } from '$lib/types';
import adventuresData from '$lib/data/adventure_data.json';
import adventuresContent from '$lib/data/adventure_content.json';

export const getAllAdventures = async (): Promise<AdventureData[]> => adventuresData;

export const getAdventuresDone = async (): Promise<AdventureData[]> => {
	return adventuresData.sort(function (a, b) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
};

export const getLatestAdventures = async (): Promise<AdventureData[]> => {
	const adventures = await getAdventuresDone();
	return adventures.slice(0, 3);
};

export const getAdventureById = async (adventureId: string): Promise<Adventure> => {
	const adventureContent = adventuresContent.find(
		(adventureContent) => String(adventureContent.id) === adventureId
	);
	const adventureData = adventuresData.find(
		(adventureData) => String(adventureData.id) === adventureId
	);
	if (!adventureData || !adventureContent) throw new Error('Could not find adventure');
	return {
		...adventureContent,
		...adventureData
	};
};

export const getAdventureDataBySportSlug = (sportSlug: string): AdventureData[] => {
	return adventuresData.filter((adventureData) => adventureData.sports?.includes(sportSlug));
};

export const formatAssetUrl = (assetUrl: string): string =>
	assetUrl.startsWith('/') ? `${config.BASE_API_URL}${assetUrl}` : assetUrl;

export const getCoverPicture = (adventure: Adventure): Picture | null =>
	adventure.cover
		? adventure.cover
		: adventure.pictures && adventure.pictures.length > 0
		? adventure.pictures[0]
		: null;
