import merge from 'lodash/merge';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import type { Adventure, AdventureData, AdventureContent, Picture } from '$lib/types';
import { slugify } from '$lib/utils/string';
import { ROUTES } from '$lib/config/routes';
import { getHead } from './s3/frontend';
import { ADVENTURE_TYPE } from './s3/shared';

export const getAdventuresContent = async () =>
	(await getHead(ADVENTURE_TYPE.CONTENT)) as AdventureContent[];
export const getAdventuresData = async () =>
	(await getHead(ADVENTURE_TYPE.DATA)) as AdventureData[];

export const getAllAdventures = async (): Promise<Adventure[]> => {
	const adventuresData = await getAdventuresData();
	const adventuresContent = await getAdventuresContent();

	return values(merge({}, keyBy(adventuresData, 'id'), keyBy(adventuresContent, 'id')));
};

export const getAdventuresDone = async (): Promise<Adventure[]> => {
	const adventures = await getAllAdventures();
	return adventures.sort(function (a, b) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
};

export const getLatestAdventures = async (): Promise<Adventure[]> => {
	const adventures = await getAdventuresDone();
	return adventures.slice(0, 4);
};

export const getAdventureById = async (adventureId: string): Promise<Adventure> => {
	const adventureContent = (await getAdventuresContent()).find(
		(adventureContent) => adventureContent.id === adventureId
	);
	const adventureData = (await getAdventuresData()).find(
		(adventureData) => adventureData.id === adventureId
	);
	if (!adventureData || !adventureContent) throw new Error('Could not find adventure');
	return {
		...adventureContent,
		...adventureData
	};
};

export const getAdventureDataBySportSlug = async (sportSlug: string): Promise<AdventureData[]> => {
	return (await getAdventuresData()).filter((adventureData) =>
		adventureData.sports?.includes(sportSlug)
	);
};

export const getCoverPicture = (adventure: AdventureData): Picture | null =>
	adventure.cover ? adventure.cover : null;

export const getAdventurePageUrl = (adventure: Adventure) =>
	`${ROUTES.ADVENTURES.BY_ID}${adventure.id}_${slugify(adventure.title)}`;
