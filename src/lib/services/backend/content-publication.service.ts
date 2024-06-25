import {
	adventureContentFromAdventure,
	adventureDataFromAdventure
} from '$lib/data/generators/adventure';
import type {
	Adventure,
	AdventureContent,
	AdventureData,
	Picture,
	PictureFormat
} from '$lib/types';
import mapValues from 'lodash/mapValues';
import { getResizedImageUrl, uploadImage } from './cloudinary.service';
import { uploadVersionedFile } from './s3Service';
import { getAdventuresContent, getAdventuresData } from '../adventureService';

const getUpdatedAdventureData = async (newAdventure: Adventure): Promise<AdventureData[]> => [
	...(await getAdventuresData()).filter(({ id }) => id !== newAdventure.id),
	adventureDataFromAdventure(newAdventure)
];

const getUpdatedAdventureContent = async (newAdventure: Adventure): Promise<AdventureContent[]> => [
	...(await getAdventuresContent()).filter(({ id }) => id !== newAdventure.id),
	adventureContentFromAdventure(newAdventure)
];

export const publishContent = async (adventure: Adventure) => {
	const updatedAdventure = await replaceImageWithCloudinary(adventure);
	uploadVersionedFile(
		'adventure-data',
		JSON.stringify(await getUpdatedAdventureData(updatedAdventure), null, 2)
	);
	uploadVersionedFile(
		'adventure-content',
		JSON.stringify(await getUpdatedAdventureContent(updatedAdventure), null, 2)
	);
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
