<script context="module" lang="ts">
	import { getAllAdventures } from '$lib/services/adventureService';

	export const prerender = true;
	export async function load() {
		const adventures = await getAllAdventures();
		return {
			props: { adventures }
		};
	}
</script>

<script lang="ts">
	import AdventureCard from '$lib/components/adventures/adventureCard.svelte';
	import type { Adventure } from '$lib/types';

	export let adventures: Adventure[];
</script>

{#each adventures as adventure}
	<AdventureCard {adventure} />
{/each}
