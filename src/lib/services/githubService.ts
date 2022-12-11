import CryptoJS from 'crypto-js';
import config from '$lib/config';
import { getSecrets } from './secretsService';

const GITHUB_API_URL = 'https://api.github.com';
const OWNER = config.GITHUB_REPO_OWNER;
const REPO = config.GITHUB_REPO;

const getFileContentOnGithub = async (filePath: string) => {
	const response = await fetch(`${GITHUB_API_URL}/repos/${OWNER}/${REPO}/contents/${filePath}`, {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${getSecrets().githubToken}`
		}
	});

	return await response.json();
};

export const modifyFileOnGithub = async (
	message: string,
	filePath: string,
	fileContent: string
) => {
	const encodedContent = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(fileContent));

	const { sha } = await getFileContentOnGithub(filePath);

	await fetch(`${GITHUB_API_URL}/repos/${OWNER}/${REPO}/contents/${filePath}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${getSecrets().githubToken}`
		},
		body: JSON.stringify({
			message,
			committer: { name: 'Frontend', email: 'nicolas.ngomai@gmail.com' },
			content: encodedContent,
			sha
		})
	});
};
