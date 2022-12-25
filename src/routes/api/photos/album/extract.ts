import type { Photo } from '$lib/types';
import type { EndpointOutput, RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler<unknown, { shareLink: string }> = async ({
	body
}): Promise<EndpointOutput> => {
	const response = await fetch(body.shareLink, {
		method: 'POST',
		redirect: 'follow',
		mode: 'no-cors',
		referrerPolicy: 'no-referrer'
	});
	const rawHtml = await response.text();

	return {
		status: 200,
		body: extractPhotoListFromHtml(rawHtml)
	};
};

const extractPhotoListFromHtml = (rawHtml: string): Photo[] => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(rawHtml, 'text/html');
	console.log('🚀 ~ file: googlePhotoService.ts:17 ~ extractPhotoListFromHtml ~ doc', doc);

	return [];
};
