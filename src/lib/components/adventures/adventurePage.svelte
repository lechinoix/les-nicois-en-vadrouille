<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventures/adventureHeader.svelte';
	import Container from '$lib/components/container.svelte';
	import { formatFrenchDate } from '$lib/utils/date';
	import uniqBy from 'lodash/uniqBy.js';
	import findIndex from 'lodash/findIndex.js';
	import { typography } from '$lib/styles';
	import { sliderRef } from '$lib/stores/slider';
	import type { LightGallery } from 'lightgallery/lightgallery';
	import { getCoverPicture } from '$lib/services/adventureService';

	export let adventure: Adventure;

	let coverPicture: Picture | null;
	let pictures: Picture[];
	let gallery: LightGallery;

	sliderRef.subscribe((galleryInstance: LightGallery | null) => {
		if (!galleryInstance) return;
		gallery = galleryInstance;
	});

	$: coverPicture = getCoverPicture(adventure);
	$: pictures =
		coverPicture !== null && adventure.pictures !== null
			? uniqBy([coverPicture, ...adventure.pictures], 'id')
			: adventure.pictures;

	const openSlider = () => {
		if (!coverPicture) return;
		gallery.openGallery(findIndex(pictures, ['id', coverPicture.id]));
	};
</script>

<AdventureCard {adventure} onClick={openSlider} />
<Container>
	<p class={`text-justify ${typography.text}`}>
		{#if adventure.date}
			<span class="italic">{formatFrenchDate(adventure.date)}</span>
			<br />
			<br />
		{/if}
		<span class="cms-content">{@html marked(adventure.content || '')}</span>
	</p>
	<br />
	<br />
	{#if adventure.topos && adventure.topos.length > 0}
		<b>Topo</b> :
		{#each adventure.topos as topo}
			<TopoLink {topo} />
			<br />
		{/each}
	{/if}
	{#if adventure.pictures && adventure.pictures.length > 0}
		<div class="mt-5" id="slider">
			<Slider {pictures} />
		</div>
	{/if}
</Container>
