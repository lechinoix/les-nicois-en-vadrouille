<script context="module">
	export const prerender = true;
	export async function load({ page }) {
		const adventure = await getAdventureById(page.params.id);
		return {
			props: { adventure }
		};
	}
</script>

<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import { page } from '$app/stores';
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { getAdventureById } from '$lib/services/adventureService';
	import Container from '$lib/components/container.svelte';
	import { slugify, truncateText } from '$lib/utils/string';
	import { getUrlWithNewSlug } from '$lib/utils/url';
	import { browser } from '$app/env';

	export let adventure: Adventure;

	let picture: Picture;
	let adventureSlug: string;
	let pageUrl: string;

	$: {
		adventureSlug = slugify(adventure.title);
		if (browser) pageUrl = getUrlWithNewSlug(location, adventureSlug);
		if (browser && $page.params.slug !== adventureSlug)
			window.history.replaceState(null, null, pageUrl);
	}

	$: picture = adventure.cover_picture?.picture || adventure.pictures[0];
</script>

<svelte:head>
	<meta property="og:image" content={picture.formats.medium.url} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={adventure.title} />
	<meta
		property="og:description"
		content={adventure.short_description || truncateText(adventure.description)}
	/>
</svelte:head>

<AdventureCard {adventure} withLink={false} />
<Container>
	<p class="text-justify text-gray-600 text-xl font-sans font-thin leading-relaxed">
		{@html marked(adventure.description || '')}
	</p>
	<br />
	<br />
	{#if adventure.topo?.length > 0}
		<b>Topo</b> :
		{#each adventure.topo as topo}
			<TopoLink {topo} />
			<br />
		{/each}
	{/if}
	{#if adventure.pictures?.length > 0}
		<div class="mt-5">
			<Slider pictures={adventure.pictures} />
		</div>
	{/if}
</Container>
