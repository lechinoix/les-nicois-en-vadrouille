import merge from 'lodash/merge';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import type { Adventure, AdventureData, AdventureContent, Picture } from '$lib/types';
import rawAdventuresData from '$lib/data/adventure_data.json';
import rawAdventuresContent from '$lib/data/adventure_content.json';

// eslint-disable-next-line
// @ts-ignore
export const adventuresData: AdventureData[] = rawAdventuresData;
// eslint-disable-next-line
// @ts-ignore
export const adventuresContent: AdventureContent[] = rawAdventuresContent;

export const adventures: Adventure[] = values(
	merge({}, keyBy(adventuresData, 'id'), keyBy(adventuresContent, 'id'))
);

export const getAllAdventures = (): Adventure[] => adventures;

export const getAdventuresDone = (): Adventure[] => {
	return adventures.sort(function (a, b) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
};

export const getLatestAdventures = (): Adventure[] => {
	const adventures = getAdventuresDone();
	return adventures.slice(0, 3);
};

export const getAdventureById = (adventureId: string): Adventure => {
	const adventureContent = adventuresContent.find(
		(adventureContent) => adventureContent.id === adventureId
	);
	const adventureData = adventuresData.find((adventureData) => adventureData.id === adventureId);
	if (!adventureData || !adventureContent) throw new Error('Could not find adventure');
	return {
		...adventureContent,
		...adventureData
	};
};

export const getAdventureDataBySportSlug = (sportSlug: string): AdventureData[] => {
	return adventuresData.filter((adventureData) => adventureData.sports?.includes(sportSlug));
};

export const getCoverPicture = (adventure: AdventureData): Picture | null =>
	adventure.cover ? adventure.cover : null;
