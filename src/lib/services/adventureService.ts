import config from '$lib/config';
import { AdventureStatus } from '$lib/constants';
import type { Adventure } from '$lib/types';

export const getAdventuresDone = async (): Promise<Adventure[]> => {
	const res = await fetch(
		`${config.BASE_API_URL}/adventures?status=${AdventureStatus.DONE}&_sort=date:DESC`
	);
	const adventures = await res.json();
	return adventures;
};

export const getAdventuresPlanned = async (): Promise<Adventure[]> => {
	const res = await fetch(
		`${config.BASE_API_URL}/adventures?status=${AdventureStatus.PLANNED}&_sort=date:DESC`
	);
	const adventures = await res.json();
	return adventures;
};

export const getAdventuresTodo = async (): Promise<Adventure[]> => {
	const res = await fetch(`${config.BASE_API_URL}/adventures?status=${AdventureStatus.TODO}`);
	const adventures = await res.json();
	return adventures;
};

export const getAdventureById = async (adventureId: string): Promise<Adventure> => {
	const res = await fetch(`${config.BASE_API_URL}/adventures/${adventureId}`);
	const adventures = await res.json();
	return adventures;
};

export const formatAssetUrl = (assetUrl: string): string =>
	assetUrl.startsWith('/') ? `${config.BASE_API_URL}${assetUrl}` : assetUrl;
