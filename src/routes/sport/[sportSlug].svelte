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
			class="
				inline-grid
				xl:grid-cols-3 md:grid-cols-2 grid-cols-1
				grid-flow-row gap-5 justify-self-auto
				m-5"
		>
			{#each adventures as adventure}
				<a
					href={`/adventures/${adventure.id}`}
					class="
						block relative md:w-96 w-full h-52
						overflow-hidden bg-gray-300
					"
				>
					<SmallCover {adventure} />
				</a>
			{/each}
		</div>
	</div>
{/if}
