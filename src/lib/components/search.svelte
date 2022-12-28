<script lang="ts">
	import Input from './form/input.svelte';
	import debounce from 'lodash/debounce';
	import { search } from '$lib/services/searchService';
	import { getAdventureById } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';

	let term: string;
	let results: Adventure[];

	const searchForTerm = debounce(async (queryTerm) => {
		results = search(queryTerm).map(({ ref }) => getAdventureById(ref));
	}, 200);

	$: {
		searchForTerm(term);
	}
</script>

<Input label="Search" name="search" bind:value={term} />
{#if results}
	{#each results as result}
		<p>{result.title}</p>
	{/each}
{/if}
