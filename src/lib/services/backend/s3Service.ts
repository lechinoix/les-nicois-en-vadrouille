import {
	// DeleteObjectCommand,
	// ListObjectsCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { PASSWORD } from '$env/static/private';
import { getSecretsWithPassword } from '../secretsService';
import dayjs from 'dayjs';

const client = new S3Client({
	credentials: {
		accessKeyId: 'AKIASQWYB6E6EEXO4MEO',
		secretAccessKey: getSecretsWithPassword(PASSWORD).s3SecretKey
	}
});

const dataFolder = 'data';
const bucketName = 'lesnicoisenvadrouille';
const mainFileName = 'head.json';
// const maxVersionAgeInDays = 10;
// const minVersionCount = 10;

export const uploadVersionedFile = async (folderName: string, rawContent: string) => {
	// await cleanOldVersions(folderName);
	await uploadFile(`${dataFolder}/${folderName}/${mainFileName}`, rawContent);
	await uploadFile(
		`${dataFolder}/${folderName}/${dayjs().format('YYYYDDMM_HHmmss')}.json`,
		rawContent
	);
};

// const cleanOldVersions = async (folderName: string) => {
// 	const currentVersions = await client.send(
// 		new ListObjectsCommand({
// 			Bucket: bucketName,
// 			Prefix: `${dataFolder}/${folderName}`
// 		})
// 	);

// 	const versionsToClean =
// 		currentVersions.Contents?.sort(
// 			(versionA, versionB) =>
// 				dayjs(versionB.LastModified).unix() - dayjs(versionA.LastModified).unix()
// 		)
// 			?.slice(minVersionCount)
// 			?.filter((version) =>
// 				dayjs(version.LastModified).isBefore(dayjs().add(-maxVersionAgeInDays, 'day'))
// 			) ?? [];

// 	for (const versionToClean of versionsToClean) {
// 		if (!versionToClean.Key) continue;
// 		await deleteFile(versionToClean.Key);
// 	}
// };

const uploadFile = async (fileName: string, content: string) =>
	client.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: fileName,
			Body: content
		})
	);

// const deleteFile = async (fullPath: string) =>
// 	client.send(
// 		new DeleteObjectCommand({
// 			Bucket: bucketName,
// 			Key: fullPath
// 		})
// 	);
