import { v2 as cloudinary } from 'cloudinary';
import { getSecretsWithPassword } from '../secretsService';
import { PASSWORD } from '$env/static/private';

cloudinary.config({
	cloud_name: 'dowsxscl0',
	api_key: '813868563263764',
	api_secret: getSecretsWithPassword(PASSWORD).cloudinarySecretKey,
	secure: true
});

export const uploadImage = async (url: string) => {
	const uploadResponse = await cloudinary.uploader.upload(url);

	return uploadResponse;
};

export const getResizedImageUrl = (imageId: string, width: number, height: number) => {
	return cloudinary.url(imageId, {
		crop: 'scale',
		width,
		height
	});
};
