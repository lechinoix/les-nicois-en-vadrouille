import config from '$lib/config';

export const postComment = async () => {
	const res = await fetch(`${config.BASE_API_URL}/comments/adventure:${''}`, {
		method: 'POST',
		body: ''
	});
	if (!res.ok) throw new Error(res.statusText);

	return true;
};
