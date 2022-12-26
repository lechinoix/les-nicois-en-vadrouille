import type { Photo } from '$lib/types';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async (request) => {
	const body = await request.json();
	const response = await fetch(body.shareLink, {
		method: 'POST',
		redirect: 'follow',
		mode: 'no-cors',
		referrerPolicy: 'no-referrer'
	});
	const rawHtml = await response.text();

	return json(extractPhotoListFromHtml(rawHtml));
};

const extractPhotoListFromHtml = (rawHtml: string): Photo[] => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(rawHtml, 'text/html');
	console.log('🚀 ~ file: googlePhotoService.ts:17 ~ extractPhotoListFromHtml ~ doc', doc);

	return [];
};
