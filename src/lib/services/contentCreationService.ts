import type { Adventure, AdventureContent, AdventureData } from '$lib/types';
import adventureData from '$lib/data/adventure_data.json';
import adventureContent from '$lib/data/adventure_content.json';
import { modifyFileOnGithub } from './githubService';

const dataFolderPath = 'src/lib/data';
const adventureDataPath = `${dataFolderPath}/adventure_data.json`;
const adventureContentPath = `${dataFolderPath}/adventure_content.json`;

export const saveDraft = (adventure: Adventure) => {
	localStorage.setItem(draftKeyFromId(adventure.id), JSON.stringify(adventure));
};

export const getDraft = (contentId: number): Adventure | null => {
	const draftData = localStorage.getItem(draftKeyFromId(contentId));
	if (!draftData) return null;

	return JSON.parse(draftData);
};

export const clearDraft = (contentId: number): void => {
	localStorage.removeItem(draftKeyFromId(contentId));
};

const draftKeyFromId = (contentId: number) => `draft-${contentId}`;

const getUpdatedAdventureData = (newAdventure: Adventure): AdventureData[] =>
	// @ts-ignore
	adventureData.map((adventureData: AdventureData) => {
		if (adventureData.id !== newAdventure.id) return adventureData;

		return {
			id: newAdventure.id,
			title: newAdventure.title,
			cotation: newAdventure.cotation,
			cover: newAdventure.cover,
			date: newAdventure.date,
			elevation: newAdventure.elevation,
			orientation: newAdventure.orientation,
			participants: newAdventure.participants,
			places: newAdventure.places,
			sports: newAdventure.sports,
			periods: newAdventure.periods
		};
	});

const getUpdatedAdventureContent = (newAdventure: Adventure): AdventureContent[] =>
	// @ts-ignore
	adventureContent.map((adventureContent: AdventureContent) => {
		if (adventureContent.id !== newAdventure.id) return adventureContent;

		return {
			id: newAdventure.id,
			content: newAdventure.content,
			pictures: newAdventure.pictures,
			topos: newAdventure.topos
		};
	});

export const publishContent = (adventure: Adventure) => {
	modifyFileOnGithub(
		`Update adventure ${adventure.id} Data`,
		adventureDataPath,
		JSON.stringify(getUpdatedAdventureData(adventure), null, 2)
	);
	modifyFileOnGithub(
		`Update adventure ${adventure.id} Content`,
		adventureContentPath,
		JSON.stringify(getUpdatedAdventureContent(adventure), null, 2)
	);
};
