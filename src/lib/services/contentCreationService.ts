import type { Adventure, AdventureContent, AdventureData } from '$lib/types';
import adventureData from '$lib/data/adventure_data.json';
import adventureContent from '$lib/data/adventure_content.json';
import { GithubService } from './githubService';

const dataFolderPath = 'src/lib/data';
const adventureDataPath = `${dataFolderPath}/adventure_data.json`;
const adventureContentPath = `${dataFolderPath}/adventure_content.json`;

export const saveDraft = (contentId: number, adventure: Adventure) => {
	localStorage.setItem(draftKeyFromId(contentId), JSON.stringify(adventure));
};

export const getDraft = (contentId: number): Adventure => {
	const draftData = localStorage.getItem(draftKeyFromId(contentId));
	if (!draftData) throw new Error('Impossible to read draft data from localstorage');

	return JSON.parse(draftData);
};

const draftKeyFromId = (contentId: number) => `draft-${contentId}`;

const getUpdatedAdventureData = (contentId: number): AdventureData[] =>
	adventureData.map((adventure: AdventureData) => {
		if (adventure.id !== contentId) return adventure;

		const newAdventure = getDraft(contentId);

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

const getUpdatedAdventureContent = (contentId: number): AdventureContent[] =>
	adventureContent.map((adventure: AdventureContent) => {
		if (adventure.id !== contentId) return adventure;

		const newAdventure = getDraft(contentId);

		return {
			id: newAdventure.id,
			content: newAdventure.content,
			pictures: newAdventure.pictures,
			topos: newAdventure.topos
		};
	});

export const publishContent = (contentId: number) => {
	const githubService = new GithubService();
	githubService.modifyFileOnGithub(
		adventureDataPath,
		JSON.stringify(getUpdatedAdventureData(contentId), null, 2)
	);
	githubService.modifyFileOnGithub(
		adventureContentPath,
		JSON.stringify(getUpdatedAdventureContent(contentId), null, 2)
	);
};
