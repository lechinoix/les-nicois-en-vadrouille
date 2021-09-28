<script lang="ts">
	import { onMount } from 'svelte';
	import { getAdventuresTodo } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import AdventureCard from '$lib/components/adventureCard.svelte';

	let adventures: Adventure[] = [];
	let error = null;

	onMount(async () => {
		try {
			adventures = await getAdventuresTodo();
		} catch (e) {
			error = e;
		}
	});
</script>

{#if error !== null}
	{error}
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each adventures as adventure}
			<div class="column one-half">
				<AdventureCard {adventure} />
			</div>
		{/each}
	</div>
{/if}
