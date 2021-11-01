<script lang="ts">
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventureById } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';

	let adventure: Adventure = null;
	let error = null;

	onMount(async () => {
		try {
			adventure = await getAdventureById($page.params.id);
		} catch (e) {
			error = e;
		}
	});
</script>

{#if error !== null}
	{error}
{:else if adventure === null}
	<p>Loading...</p>
{:else}
	<AdventureCard {adventure} />
	<p class="my-5 container mx-auto">
		<b>Date</b> : {adventure.date} <br />
		<b>Cotation</b> : {adventure.cotation} <br />
		<b>Sports</b> : {adventure.sports.reduce((acc, el) => `${acc} ${el.name}`, '')} <br />
		<b>Description</b> : {adventure.description} <br />
		<b>Topo</b> : {#each adventure.topo as topo}
			<TopoLink {topo} />
			<br />
		{/each}
		{#if adventure.pictures.length > 0}
			<div class="mt-5">
				<Slider pictures={adventure.pictures} />
			</div>
		{/if}
	</p>
{/if}
