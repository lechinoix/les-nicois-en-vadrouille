import type { Album, Picture } from '$lib/types';
import rawAlbums from '$lib/data/albums.json';

const albums = rawAlbums as Album[];

export const getPhotosFromShareLink = async (shareLink: string): Promise<Picture[]> => {
	const response = await fetch(`/api/photos/album/extract`, {
		method: 'POST',
		body: JSON.stringify({
			shareLink
		})
	});

	return await response.json();
};

export const getAllAlbums = (): Album[] => {
	return albums;
};
