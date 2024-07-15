import type { Album, GooglePhoto, Picture, PictureFormat } from '$lib/types';
import type { RequestHandler } from '../$types';
import { error, json } from '@sveltejs/kit';
import { isAuthorized } from '$lib/api/auth';
import * as cheerio from 'cheerio';
import { evaluate } from '$lib/utils/evaluate';

export const POST: RequestHandler = async ({ request }) => {
	if (!isAuthorized(request)) throw error(401, 'Not Authorized');

	const body = await request.json();
	const response = await fetch(body.shareLink, {
		redirect: 'follow'
	});
	const rawHtml = await response.text();

	const pictures = extractPhotoListFromHtml(rawHtml, body.shareLink);
	return json(pictures);
};

const extractPhotoListFromHtml = (rawHtml: string, shareLink: string): Picture[] => {
	const $ = cheerio.load(rawHtml);

	let rawData: any;
	const AF_initDataCallback = ({ data }: any) => {
		rawData = data;
	};

	const scriptElement = $(`script:contains("${shareLink}")`);
	const scriptContent = scriptElement.text();
	evaluate(scriptContent, { AF_initDataCallback });

	if (!rawData) {
		throw new Error(`Could not extract data from script: ${scriptContent.slice(0, 1000)}`);
	}

	console.log(rawData);

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
		gPhotoId: photo.id,
		albumId: album.id,
		formats: getFormatsFromGPhoto(photo),
		...getFormatByRatio(photo, 1)
	}));
};

const getFormatsFromGPhoto = (photo: GooglePhoto): Picture['formats'] => ({
	xlarge: getFormatByMaxSize(photo, 1600),
	large: getFormatByMaxSize(photo, 1200),
	medium: getFormatByMaxSize(photo, 900),
	small: getFormatByMaxSize(photo, 500),
	thumbnail: getFormatByMaxSize(photo, 300)
});

const getFormatByMaxSize = (photo: GooglePhoto, maxSize: number): PictureFormat => {
	const actualSize = Math.max(photo.width, photo.height);
	const ratio = maxSize / actualSize;
	return getFormatByRatio(photo, ratio);
};

const getFormatByRatio = (photo: GooglePhoto, ratio: number): PictureFormat => {
	const width = Math.floor(photo.width * ratio);
	const height = Math.floor(photo.height * ratio);
	return getFormat(photo, width, height);
};

const getFormat = (photo: GooglePhoto, width: number, height: number): PictureFormat => {
	return {
		height,
		width,
		url: `${photo.baseLink}=w${width}-h${height}`
	};
};
