<script lang="ts">
	import { onMount } from 'svelte';
	import { getAdventuresDone } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import Loader from '$lib/components/loader.svelte';
	import Description from '$lib/components/description.svelte';

	let adventures: Adventure[] = [];
	let error = null;

	onMount(async () => {
		try {
			adventures = await getAdventuresDone();
		} catch (e) {
			error = e;
		}
	});
</script>

{#if error !== null}
	{error}
{:else if adventures.length === 0}
	<Loader />
{:else}
	{#each adventures as adventure}
		<AdventureCard {adventure}>
			<Description className="pt-7">
				{adventure.short_description || truncateText(adventure.description)}
			</Description>
		</AdventureCard>
	{/each}
{/if}
