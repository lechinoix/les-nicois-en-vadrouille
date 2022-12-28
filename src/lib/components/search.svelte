<script lang="ts">
	import Input from './form/input.svelte';
	import debounce from 'lodash/debounce';
	import { search } from '$lib/services/searchService';
	import { getAdventureById } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';

	export let clickResult: (result: Adventure) => void;

	let term: string;
	let results: Adventure[];

	const searchForTerm = debounce(async (queryTerm) => {
		results = search(queryTerm).map(({ ref }) => getAdventureById(ref));
	}, 200);

	$: {
		searchForTerm(term);
	}
</script>

<div class="relative">
	<Input label="Search" name="search" bind:value={term} />
	{#if results && results.length > 0}
		<ul
			class="z-10 absolute border border-gray-300 text-gray-900 text-sm rounded-b-lg w-full flex flex-col"
		>
			{#each results as result}
				<li
					on:click={() => clickResult(result)}
					class="bg-white px-2 py-3 border-b border-gray-300 last:border-b-0 last:rounded-b-lg cursor-pointer hover:bg-gray-50"
				>
					{result.title}
				</li>
			{/each}
		</ul>
	{/if}
</div>
