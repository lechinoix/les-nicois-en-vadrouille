export const isAuthorized = (request: Request): boolean => {
	const authorizationHeader = request.headers.get('Authorization');
	if (!authorizationHeader) return false;

	const token = authorizationHeader?.replace('Bearer ', '');

	return token === process.env.API_KEY;
};
