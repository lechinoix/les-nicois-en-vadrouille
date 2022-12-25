import type { Photo } from '$lib/types';

export const getPhotosFromShareLink = async (shareLink: string): Promise<Photo[]> => {
	const response = await fetch(`/api/photos/album/extract`, {
		method: 'POST',
		body: JSON.stringify({
			shareLink
		})
	});

	return await response.json();
};
