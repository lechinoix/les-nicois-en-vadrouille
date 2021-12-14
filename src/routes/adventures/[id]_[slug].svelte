<script context="module">
	export const prerender = true;
	export async function load({ page }) {
		const adventure = await getAdventureById(page.params.id);
		return {
			props: { adventure },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { page } from '$app/stores';
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { getAdventureById } from '$lib/services/adventureService';
	import Container from '$lib/components/container.svelte';
	import { slugify } from '$lib/utils/string';
	import { getUrlWithNewSlug } from '$lib/utils/url';
	import { browser } from '$app/env';

	export let adventure: Adventure;

	if (browser) {
		let adventureSlug = slugify(adventure.title);
		if ($page.params.slug !== adventureSlug)
			window.history.replaceState(null, null, getUrlWithNewSlug(location, adventureSlug));
	}
</script>

<AdventureCard {adventure} withLink={false} />
<Container>
	<p class="text-justify text-gray-600 text-xl font-serif font-light leading-relaxed">
		{@html marked(adventure.description)}
	</p>
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
