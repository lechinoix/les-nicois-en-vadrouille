<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventuresBySportSlug } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import Loader from '$lib/components/loader.svelte';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';

	let adventures: Adventure[] = null;
	let error = null;

	onMount(async () => {
		try {
			adventures = await getAdventuresBySportSlug($page.params.sportSlug);
			console.log(adventures);
		} catch (e) {
			error = e;
		}
	});
</script>

{#if error !== null}
	{error}
{:else if adventures === null}
	<Loader />
{:else}
	<div class="flex justify-center">
		<div
			class="inline-grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-flow-row gap-5 justify-self-auto"
		>
			{#each adventures as adventure}
				<div class="relative md:w-96 h-52 w-full overflow-hidden mx-3 my-4 bg-gray-300">
					<SmallCover {adventure} />
				</div>
			{/each}
		</div>
	</div>
{/if}
