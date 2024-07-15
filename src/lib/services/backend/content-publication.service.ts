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
import { uploadVersionedFile } from '../s3/backend';
import { ADVENTURE_TYPE } from '../s3/shared';
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
	await Promise.all([
		uploadVersionedFile(
			ADVENTURE_TYPE.DATA,
			JSON.stringify(await getUpdatedAdventureData(updatedAdventure), null, 2)
		),
		uploadVersionedFile(
			ADVENTURE_TYPE.CONTENT,
			JSON.stringify(await getUpdatedAdventureContent(updatedAdventure), null, 2)
		)
	]);
};

export const replaceImageWithCloudinary = async (adventure: Adventure): Promise<Adventure> => {
	const coverPosition = adventure.pictures.findIndex(
		(picture) => picture.id === adventure.cover?.id
	);
	const newImages = await Promise.all(adventure.pictures.map(createCloudinaryImageWithFormats));
	return {
		...adventure,
		pictures: newImages,
		cover:
			coverPosition !== -1
				? {
						...newImages[coverPosition],
						position: adventure.cover?.position ?? 'CENTER'
				  }
				: null
	};
};

export const createCloudinaryImageWithFormats = async (picture: Picture): Promise<Picture> => {
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
