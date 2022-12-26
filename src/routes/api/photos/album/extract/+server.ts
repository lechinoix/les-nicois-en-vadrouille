import type { Album, GooglePhoto, Picture, PictureFormat } from '$lib/types';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import jsdom, { JSDOM } from 'jsdom';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const response = await fetch(body.shareLink, {
		redirect: 'follow'
	});
	const rawHtml = await response.text();

	return json(extractPhotoListFromHtml(rawHtml, body.shareLink));
};

const extractPhotoListFromHtml = (rawHtml: string, shareLink: string): Picture[] => {
	const virtualConsole = new jsdom.VirtualConsole();
	const { window } = new JSDOM(rawHtml, {
		runScripts: 'dangerously',
		virtualConsole
	});

	const rawData = window.AF_initDataChunkQueue[0].data;

	const rawAlbumData = rawData[3];
	const album: Album = {
		id: rawAlbumData[0],
		title: rawAlbumData[1],
		shareLink
	};

	const rawPictureListwindow = rawData[1];
	const photoList: GooglePhoto[] = rawPictureListwindow.map((rawPicture: any) => ({
		id: rawPicture[0],
		baseLink: rawPicture[1][0],
		width: rawPicture[1][1],
		height: rawPicture[1][2],
		date: rawPicture[2]
	}));

	return formatPicturesFromGPhotos(photoList, album);
};

const formatPicturesFromGPhotos = (photoList: GooglePhoto[], album: Album): Picture[] => {
	return photoList.map((photo) => ({
		id: photo.id,
		album: album,
		formats: getFormatsFromGPhoto(photo),
		...getFormatByRatio(photo, 1)
	}));
};

const getFormatsFromGPhoto = (photo: GooglePhoto): Picture['formats'] => ({
	xlarge: getFormatByRatio(photo, 1),
	large: getFormatByRatio(photo, 0.8),
	medium: getFormatByRatio(photo, 0.5),
	small: getFormatByRatio(photo, 0.3),
	thumbnail: getFormatByRatio(photo, 0.1)
});

const getFormatByRatio = (photo: GooglePhoto, ratio: number): PictureFormat => {
	const width = Math.floor(photo.width * ratio);
	const height = Math.floor(photo.height * ratio);
	return {
		height,
		width,
		url: `${photo.baseLink}=w${width}-h${height}`
	};
};
