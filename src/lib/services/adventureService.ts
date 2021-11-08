import config from '$lib/config';
import { AdventureStatus } from '$lib/constants';
import type { Adventure } from '$lib/types';

const fetchAdventures = async (searchParams: URLSearchParams) => {
	const res = await fetch(`${config.BASE_API_URL}/adventures?${searchParams.toString()}`);
	const adventures = await res.json();
	return adventures;
};

export const getAdventuresDone = async (): Promise<Adventure[]> => {
	const searchParams = new URLSearchParams({
		status: AdventureStatus.DONE,
		_sort: 'date:DESC'
	});

	return await fetchAdventures(searchParams);
};

export const getAdventuresPlanned = async (): Promise<Adventure[]> => {
	const searchParams = new URLSearchParams({
		status: AdventureStatus.PLANNED,
		_sort: 'date:DESC'
	});

	return await fetchAdventures(searchParams);
};

export const getAdventuresTodo = async (): Promise<Adventure[]> => {
	const searchParams = new URLSearchParams({
		status: AdventureStatus.TODO
	});

	return await fetchAdventures(searchParams);
};

export const getAdventureById = async (adventureId: string): Promise<Adventure> => {
	const res = await fetch(`${config.BASE_API_URL}/adventures/${adventureId}`);
	const adventures = await res.json();
	return adventures;
};

export const getAdventuresBySportSlug = async (sportSlug: string): Promise<Adventure[]> => {
	const res = await fetch(`${config.BASE_API_URL}/sports?slug=${sportSlug}`);
	const sports = await res.json();

	if (sports.length === 0) throw new Error('Unkown sport');

	return sports[0].adventures.filter((adventure) => adventure.status === AdventureStatus.DONE);
};

export const formatAssetUrl = (assetUrl: string): string =>
	assetUrl.startsWith('/') ? `${config.BASE_API_URL}${assetUrl}` : assetUrl;
