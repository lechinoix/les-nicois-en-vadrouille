import rawPlaces from '$lib/data/places.json';
import type { Place } from '$lib/types';

export const places = rawPlaces as Place[];

export const getAllPlaces = () => {
	return places;
};
