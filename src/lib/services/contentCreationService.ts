import type { Adventure, AdventureContent, AdventureData } from '$lib/types';
import { adventuresData, adventuresContent } from '$lib/services/adventureService';
import { modifyFileOnGithub } from './githubService';
import { generateId } from '$lib/utils/idGenerator';
import {
	adventureContentFromAdventure,
	adventureDataFromAdventure,
	newAdventure
} from '$lib/data/generators/adventure';

const dataFolderPath = 'src/lib/data';
const adventureDataPath = `${dataFolderPath}/adventure_data.json`;
const adventureContentPath = `${dataFolderPath}/adventure_content.json`;

export const createNewDraft = (): string => {
	const newAdventureId = generateId();
	localStorage.setItem(
		draftKeyFromId(newAdventureId),
		JSON.stringify(newAdventure(newAdventureId))
	);

	return newAdventureId;
};

export const saveDraft = (adventure: Adventure) => {
	localStorage.setItem(draftKeyFromId(adventure.id), JSON.stringify(adventure));
};

export const getDraft = (contentId: string): Adventure | null => {
	const draftData = localStorage.getItem(draftKeyFromId(contentId));
	if (!draftData) return null;

	return JSON.parse(draftData);
};

export const clearDraft = (contentId: string): void => {
	localStorage.removeItem(draftKeyFromId(contentId));
};

const draftKeyFromId = (contentId: string) => `draft-${contentId}`;

const getUpdatedAdventureData = (newAdventure: Adventure): AdventureData[] =>
	adventuresData.map((adventureData: AdventureData) => {
		if (adventureData.id !== newAdventure.id) return adventureData;

		return adventureDataFromAdventure(newAdventure);
	});

const getUpdatedAdventureContent = (newAdventure: Adventure): AdventureContent[] =>
	adventuresContent.map((adventureContent: AdventureContent) => {
		if (adventureContent.id !== newAdventure.id) return adventureContent;

		return adventureContentFromAdventure(newAdventure);
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
