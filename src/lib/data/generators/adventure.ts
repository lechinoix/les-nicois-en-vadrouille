import type { Adventure } from '$lib/types';

export const adventureDataFromAdventure = (adventure: Adventure) => ({
	id: adventure.id,
	title: adventure.title,
	cotation: adventure.cotation,
	cover: adventure.cover,
	date: adventure.date,
	elevation: adventure.elevation,
	orientation: adventure.orientation,
	participants: adventure.participants,
	places: adventure.places,
	sports: adventure.sports,
	periods: adventure.periods
});

export const adventureContentFromAdventure = (adventure: Adventure) => ({
	id: adventure.id,
	content: adventure.content,
	pictures: adventure.pictures,
	topos: adventure.topos
});

export const newAdventure = (id: string): Adventure => ({
	id,
	title: 'My awesome adventure',
	cotation: null,
	cover: null,
	date: '',
	elevation: null,
	orientation: null,
	participants: [],
	places: [],
	sports: [],
	periods: [],
	content: '',
	pictures: [],
	topos: []
});
