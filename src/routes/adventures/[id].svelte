<script context="module">
	export const prerender = true;
	export async function load({ page, fetch }) {
		const adventure = await getAdventureById(page.params.id);
		return {
			props: { adventure },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import type { Adventure } from '$lib/types';
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { getAdventureById } from '$lib/services/adventureService';
	import Description from '$lib/components/description.svelte';
	import Container from '$lib/components/container.svelte';

	export let adventure: Adventure;
</script>

<AdventureCard {adventure} />
<Container>
	<Description>{@html marked(adventure.description)}</Description>
	<br />
	<br />
	{#if adventure.topo && adventure.topo.length > 0}
		<b>Topo</b> :
		{#each adventure.topo as topo}
			<TopoLink {topo} />
			<br />
		{/each}
	{/if}
	{#if adventure.pictures.length > 0}
		<div class="mt-5">
			<Slider pictures={adventure.pictures} />
		</div>
	{/if}
</Container>
