import type { Sport } from '$lib/types';
import rawSports from '$lib/data/sports.json';

// eslint-disable-next-line
// @ts-ignore
export const sports: Sport[] = rawSports;

export const getSportBySlug = (sportSlug: string): Sport => {
	const sport = sports.find((sport) => sport.slug === sportSlug);
	if (!sport) throw new Error('Could not find sport by slug');

	return sport;
};

export const getAllSports = (): Sport[] => {
	return sports;
};
