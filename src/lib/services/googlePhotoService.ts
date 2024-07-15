import type { Album, Picture } from '$lib/types';
import rawAlbums from '$lib/data/albums.json';
import { createApiClient } from './apiService';

const albums = rawAlbums as Album[];

export const getPhotosFromShareLink = async (shareLink: string): Promise<Picture[]> => {
	const apiClient = createApiClient();
	const response = await apiClient<{ shareLink: string }>({
		url: `/api/picture/album/extract`,
		method: 'POST',
		data: {
			shareLink
		}
	});

	return response.data as Picture[];
};

export const getAllAlbums = (): Album[] => {
	return albums;
};
