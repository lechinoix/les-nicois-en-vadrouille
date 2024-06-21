import { v2 as cloudinary } from 'cloudinary';
import { getSecrets } from './secretsService';

cloudinary.config({
	cloud_name: 'dowsxscl0',
	api_key: '813868563263764',
	api_secret: getSecrets().cloudinarySecretKey
});

export const uploadImage = async (url: string) => {
	const uploadResponse = await cloudinary.uploader.upload(url);

	return uploadResponse;
};

export const getResizedImageUrl = (imageId: string, width: number, height: number) => {
	return cloudinary.url(imageId, {
		fetch_format: 'auto',
		quality: 'auto',
		crop: 'scale',
		gravity: 'auto',
		width,
		height
	});
};
