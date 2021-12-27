import config from '$lib/config';
import type { Picture } from '$lib/types';

export const fetchPictureById = async (fetch: any, pictureId: string): Promise<Picture> => {
	const res = await fetch(`${config.BASE_API_URL}/upload/files/${pictureId}`);
	const { data: picture } = await res.json();
	return picture;
};
