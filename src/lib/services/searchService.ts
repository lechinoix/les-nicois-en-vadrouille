import { searchDocumentFromAdventure } from '$lib/data/generators/adventure';
import lunr from 'lunr';
import { adventures } from './adventureService';

let index: lunr.Index;

export type SearchResult = {
	score: number;
	ref: string;
};

export const initSearch = () => {
	index = lunr(function () {
		this.ref('id');
		this.field('content');
		this.field('title');

		adventures.forEach((adventure) => {
			this.add(searchDocumentFromAdventure(adventure));
		}, this);
	});
};

export const search = (term: string): SearchResult[] => {
	if (!term) return [];
	if (!index) {
		initSearch();
	}

	const searchQuery = term
		.split(' ')
		.filter((word) => word.length > 2)
		.map((word) => `title:${word}*^10 content:${word}*`)
		.join(' ');

	if (!searchQuery) return [];

	return index.search(searchQuery).map(({ score, ref }) => ({ score, ref }));
};
