import { getAdventureById, getAdventurePageUrl } from '$lib/services/adventureService';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const adventure = await getAdventureById(params.id);
	return {
		status: 302,
		headers: { Location: getAdventurePageUrl(adventure) }
	};
};
