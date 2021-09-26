import config from '$lib/config';
import type { Adventure } from '$lib/types';

export const getAdventures = async (): Promise<Adventure[]> => {
	const res = await fetch(`${config.BASE_API_URL}/adventures`);
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
