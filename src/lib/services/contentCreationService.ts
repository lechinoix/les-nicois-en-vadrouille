import type {
	Adventure,
	AdventureContent,
	AdventureData,
	Picture,
	PictureFormat
} from '$lib/types';
import { adventuresData, adventuresContent } from '$lib/services/adventureService';
import { generateId } from '$lib/utils/idGenerator';
import {
	adventureContentFromAdventure,
	adventureDataFromAdventure,
	newAdventure
} from '$lib/data/generators/adventure';
import startsWith from 'lodash/startsWith';
import { getResizedImageUrl, uploadImage } from './cloudinary.service';
import mapValues from 'lodash/mapValues';
import { uploadVersionedFile } from './s3Service';

const DRAFT_PREFIX = 'draft-';

export const getAllDrafts = (): Adventure[] => {
	const items = { ...localStorage };

	return Object.keys(items)
		.filter((key) => startsWith(key, DRAFT_PREFIX))
		.map((key) => JSON.parse(items[key]));
};

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
	window.dispatchEvent(new Event('storage'));
};

const draftKeyFromId = (contentId: string) => `${DRAFT_PREFIX}${contentId}`;

const getUpdatedAdventureData = (newAdventure: Adventure): AdventureData[] => [
	...adventuresData.filter(({ id }) => id !== newAdventure.id),
	adventureDataFromAdventure(newAdventure)
];

const getUpdatedAdventureContent = (newAdventure: Adventure): AdventureContent[] => [
	...adventuresContent.filter(({ id }) => id !== newAdventure.id),
	adventureContentFromAdventure(newAdventure)
];

export const publishContent = async (adventure: Adventure) => {
	const updatedAdventure = await replaceImageWithCloudinary(adventure);
	uploadVersionedFile('adventure-data.json', JSON.stringify(getUpdatedAdventureData(updatedAdventure), null, 2))
	uploadVersionedFile('adventure-content.json', JSON.stringify(getUpdatedAdventureContent(updatedAdventure), null, 2))
	
};

export const replaceImageWithCloudinary = async (adventure: Adventure): Promise<Adventure> => {
	return {
		...adventure,
		pictures: await Promise.all(adventure.pictures.map(createCloudinaryImageWithFormats)),
		cover: adventure.cover
			? {
					...(await createCloudinaryImageWithFormats(adventure.cover)),
					position: adventure.cover?.position
			  }
			: null
	};
};

const createCloudinaryImageWithFormats = async (picture: Picture): Promise<Picture> => {
	if (picture.url.includes('cloudinary')) return picture;

	const response = await uploadImage(picture.url);

	return {
		albumId: picture.albumId,
		id: response.public_id,
		url: response.url,
		width: response.width,
		height: response.height,
		formats: mapValues(picture.formats, (format: PictureFormat) => ({
			url: getResizedImageUrl(response.public_id, format.width, format.height),
			height: format.height,
			width: format.width
		}))
	};
};
