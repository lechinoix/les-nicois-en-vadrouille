import type { Photo } from '$lib/types';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import jsdom, { JSDOM } from 'jsdom';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const response = await fetch(body.shareLink, {
		redirect: 'follow'
	});
	const rawHtml = await response.text();

	return json(extractPhotoListFromHtml(rawHtml));
};

const extractPhotoListFromHtml = (rawHtml: string): Photo[] => {
	const virtualConsole = new jsdom.VirtualConsole();
	const { window } = new JSDOM(rawHtml, {
		runScripts: 'dangerously',
		virtualConsole
	});
	const rawPictureListwindow = window.AF_initDataChunkQueue[0].data[1];
	const photoList: Photo[] = rawPictureListwindow.map((rawPicture: any) => ({
		id: rawPicture[0],
		baseLink: rawPicture[1][0],
		width: rawPicture[1][1],
		height: rawPicture[1][2],
		date: rawPicture[2]
	}));

	return photoList;
};
