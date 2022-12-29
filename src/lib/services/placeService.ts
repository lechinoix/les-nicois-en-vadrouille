import rawPlaces from '$lib/data/places.json';
import type { Place } from '$lib/types';

export const places = rawPlaces as Place[];

export const getPlaceByName = (placeName: string): Place => {
	const foundPlace = places.find((place) => place.name === placeName);

	if (!foundPlace) throw new Error('No place with this name');
	return foundPlace;
};

export const getAllPlaces = () => {
	return places;
};
