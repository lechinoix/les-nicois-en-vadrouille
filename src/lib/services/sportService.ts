import config from '$lib/config';
import type { Sport } from '$lib/types';

export const getSportBySlug = async (fetch: any, sportSlug: string): Promise<Sport> => {
	const res = await fetch(`${config.BASE_API_URL}/sports?slug=${sportSlug}`);
	const result = await res.json();
	const { data: sports } = result;

	if (sports.length === 0) throw new Error('Unkown sport');

	return sports[0];
};

export const getAllSports = async (fetch: any): Promise<Sport[]> => {
	const res = await fetch(`${config.BASE_API_URL}/sports`);
	const result = await res.json();
	const { data: sports } = result;
	if (sports.length === 0) throw new Error('Unkown sport');

	return sports.filter((sport) => sport.adventures.length > 0);
};
