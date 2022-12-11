import development from './development';
import production from './production';

const config = {
	development,
	production
};

const sharedConfig = {
	GITHUB_REPO_OWNER: 'lechinoix',
	GITHUB_REPO: 'our-little-adventure-front',
	GITHUB_MAIN_BRANCH: 'main'
};

const getEnv = () => (process.env.NODE_ENV === 'production' ? 'production' : 'development');

export default {
	...config[getEnv()],
	...sharedConfig
};
