<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import lightGallery from 'lightgallery';
	import lgThumbnail from 'lightgallery/plugins/thumbnail/lg-thumbnail.umd';
	import lgZoom from 'lightgallery/plugins/zoom/lg-zoom.umd';
	import { formatAssetUrl } from '$lib/services/adventureService';
	import type { Picture } from '$lib/types';

	export const ssr = false;
	export let pictures: Picture[] = [];
	export let galleryName: string = 'lightgallery';

	onMount(() => {
		if (!browser) return;
		lightGallery(document.getElementById('lightgallery'), {
			plugins: [lgZoom, lgThumbnail],
			speed: 500
		});
	});
</script>

<div id={galleryName}>
	{#each pictures as picture}
		<a
			data-lg-size={`${picture.width}-${picture.height}`}
			data-src={formatAssetUrl(picture.formats.large.url)}
		>
			<img
				alt={picture.alternativeText}
				src={formatAssetUrl(picture.formats.small.url)}
				class="image__inpage"
			/>
		</a>
	{/each}
</div>

<style>
	@import 'lightgallery/css/lightgallery.css';
	@import 'lightgallery/css/lg-zoom.css';
	@import 'lightgallery/css/lg-thumbnail.css';

	.image__inpage {
		max-width: 400px;
	}
</style>
