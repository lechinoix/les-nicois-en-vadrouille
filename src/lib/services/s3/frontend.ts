import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { bucketName, dataFolder, headFileName, ADVENTURE_TYPE } from './shared';

const instance = Axios.create();
const axios = setupCache(instance, { interpretHeader: true, etag: true });

export const getHead = async (adventureType: ADVENTURE_TYPE) => {
	const response = await axios({
		url: `https://${bucketName}.s3.eu-west-3.amazonaws.com/${dataFolder}/${adventureType}/${headFileName}`
	});

	return response.data;
};
