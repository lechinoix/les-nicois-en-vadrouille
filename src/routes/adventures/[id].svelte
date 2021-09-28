<script lang="ts">
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
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
	<h2>{adventure.title}</h2>
	{#if adventure.pictures.length > 0}
		<Slider pictures={adventure.pictures} />
	{/if}
	<p>
		<b>Date</b> : {adventure.date} <br />
		<b>Cotation</b> : {adventure.cotation} <br />
		<b>Sports</b> : {adventure.sports.reduce((acc, el) => `${acc} ${el.name}`, '')} <br />
		<b>Description</b> : {adventure.description} <br />
		<b>Topo</b> : {#each adventure.topo as topo}
			<TopoLink {topo} />
			<br />
		{/each}
	</p>
{/if}
