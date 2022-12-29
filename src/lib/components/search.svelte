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
	<form>
		<label
			for="default-search"
			class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label
		>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<span class="material-icons text-gray-500 dark:text-gray-400">search</span>
			</div>
			<input
				bind:value={term}
				type="search"
				id="search"
				class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Recherchez par titre ou contenu"
				required
			/>
		</div>
	</form>
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
