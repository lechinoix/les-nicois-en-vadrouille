import config from '$lib/config';
import type { Sport } from '$lib/types';
import sports from 'data/sports.json';

export const getSportBySlug = async (sportSlug: string): Promise<Sport> => {
	const sport = sports.find((sport) => sport.slug === sportSlug);
	if (!sport) throw new Error('Could not find sport by slug');

	return sport;
};

export const getAllSports = async (): Promise<Sport[]> => {
	return sports;
};
