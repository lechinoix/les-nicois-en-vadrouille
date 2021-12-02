<script context="module">
	export const prerender = true;
	export async function load() {
		const adventures = await getAdventuresDone();
		return {
			props: { adventures },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { getAdventuresDone } from '$lib/services/adventureService';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import Description from '$lib/components/description.svelte';

	export let adventures: Adventure[];
</script>

{#each adventures as adventure}
	<AdventureCard {adventure}>
		<Description className="pt-7">
			{adventure.short_description || truncateText(adventure.description)}
		</Description>
	</AdventureCard>
{/each}
