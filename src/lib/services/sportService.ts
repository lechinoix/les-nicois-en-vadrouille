import type { Sport } from '$lib/types';
import rawSports from '$lib/data/sports.json';

// eslint-disable-next-line
// @ts-ignore
export const sports: Sport[] = rawSports;

export const getSportBySlug = (sportSlug: string): Sport | undefined =>
	sports.find((sport) => sport.slug === sportSlug);

export const getAllSports = (): Sport[] => {
	return sports;
};
