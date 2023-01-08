import { API_KEY } from '$env/static/private';

export const isAuthorized = (request: Request): boolean => {
	const authorizationHeader = request.headers.get('Authorization');
	if (!authorizationHeader) return false;

	const token = authorizationHeader?.replace('Bearer ', '');

	return token === API_KEY;
};
