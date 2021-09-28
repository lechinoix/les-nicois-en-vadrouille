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
	<div class="grid grid-cols-3 gap-4 ">
		{#each adventures as adventure}
			<div class="column one-half">
				<AdventureCard {adventure} />
			</div>
		{/each}
	</div>
{/if}
