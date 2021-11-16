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

export const getLatestAdventures = async (): Promise<Adventure[]> => {
	const adventures = await getAdventuresDone();
	return adventures.slice(0, 3);
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

export const formatAssetUrl = (assetUrl: string): string =>
	assetUrl.startsWith('/') ? `${config.BASE_API_URL}${assetUrl}` : assetUrl;
