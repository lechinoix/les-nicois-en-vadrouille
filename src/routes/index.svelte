<script lang="ts">
	import { onMount } from 'svelte';
	import { getAdventuresDone } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import AdventureCard from '$lib/components/adventureCard.svelte';

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
{:else}
	{#each adventures as adventure}
		<AdventureCard {adventure}>
			<p class="pt-7">
				{adventure.description}
			</p>
		</AdventureCard>
	{/each}
{/if}
