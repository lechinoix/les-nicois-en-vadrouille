import type { RequestHandler } from '../$types';
import { error } from '@sveltejs/kit';
import { isAuthorized } from '$lib/api/auth';
import { publishContent } from '$lib/services/backend/content-publication.service';
import type { Adventure } from '$lib/types';

export const PUT: RequestHandler = async ({ request }) => {
	if (!isAuthorized(request)) throw error(401, 'Not Authorized');

	const body = (await request.json()) as { adventure: Adventure };

	await publishContent(body.adventure);

	return new Response();
};
