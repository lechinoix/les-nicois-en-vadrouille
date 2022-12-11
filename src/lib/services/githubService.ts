import { Octokit } from '@octokit/rest';
import config from '$lib/config';

export class GithubService {
	octokit: Octokit;

	constructor() {
		this.octokit = new Octokit({
			auth: 'MY_ACCESS_TOKEN'
		});
	}

	modifyFileOnGithub = (filePath: string, fileContent: string) =>
		this.octokit.repos.createOrUpdateFileContents({
			owner: config.GITHUB_REPO_OWNER,
			repo: config.GITHUB_REPO,
			path: filePath,
			message: `Update adventureData`,
			content: Buffer.from(fileContent).toString('base64'),
			branch: config.GITHUB_MAIN_BRANCH
		});
}
