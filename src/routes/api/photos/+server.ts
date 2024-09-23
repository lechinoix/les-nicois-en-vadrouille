import type { RequestHandler } from '../$types';
import { error, json } from '@sveltejs/kit';
import { isAuthorized } from '$lib/api/auth';
import { createCloudinaryImageWithFormats } from '$lib/services/backend/content-publication.service';
import type { Picture } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	if (!isAuthorized(request)) throw error(401, 'Not Authorized');

	const body = (await request.json()) as { picture: Picture };

	const updatedPicture = await createCloudinaryImageWithFormats(body.picture);

	console.log(updatedPicture);

	return json(updatedPicture);
};
