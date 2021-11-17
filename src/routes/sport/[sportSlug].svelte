<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventuresBySportSlug } from '$lib/services/sportService';
	import type { Adventure } from '$lib/types';
	import Loader from '$lib/components/loader.svelte';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';

	let adventures: Adventure[] = null;
	let error = null;

	const updateAdventures = async (pageValue) => {
		try {
			adventures = await getAdventuresBySportSlug(pageValue.params.sportSlug);
		} catch (e) {
			error = e;
		}
	};

	const unsubscribe = page.subscribe(updateAdventures);
	onDestroy(unsubscribe);
</script>

{#if error !== null}
	{error}
{:else if adventures === null}
	<Loader />
{:else}
	<div class="flex justify-center">
		<div
			class="
				inline-grid
				xl:grid-cols-3 md:grid-cols-2 grid-cols-1
				grid-flow-row gap-5 justify-self-auto
				m-5"
		>
			{#each adventures as adventure}
				<SmallCover {adventure} />
			{/each}
		</div>
	</div>
{/if}
