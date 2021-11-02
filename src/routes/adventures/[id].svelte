<script lang="ts">
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventureById } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import Loader from '$lib/components/loader.svelte';
	import Description from '$lib/components/description.svelte';
	import Container from '$lib/components/Container.svelte';

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
	<Loader />
{:else}
	<AdventureCard {adventure} />
	<Container>
		<Description>{adventure.description}</Description>
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
{/if}
