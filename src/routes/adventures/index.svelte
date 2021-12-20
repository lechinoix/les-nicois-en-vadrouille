<script context="module">
	export const prerender = true;
	export async function load() {
		const adventures = await getAdventuresDone();
		return {
			props: { adventures }
		};
	}
</script>

<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { getAdventuresDone } from '$lib/services/adventureService';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventureCard.svelte';

	export let adventures: Adventure[];
</script>

{#each adventures as adventure}
	<AdventureCard {adventure}>
		<p class="text-justify text-gray-600 text-xl font-serif font-light leading-relaxed pt-7">
			{adventure.short_description || truncateText(adventure.description)}
		</p>
	</AdventureCard>
{/each}
