<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { formatAssetUrl } from '$lib/services/adventureService';
	import type { Picture } from '$lib/types';

	export const ssr = false;
	export let pictures: Picture[] = [];
	export let galleryName: string = 'lightgallery';

	onMount(async () => {
		if (!browser) return;
		const { default: lightGallery } = await import('lightgallery');
		const { default: lgThumbnail } = await import(
			'lightgallery/plugins/thumbnail/lg-thumbnail.umd'
		);
		const { default: lgZoom } = await import('lightgallery/plugins/zoom/lg-zoom.umd');

		lightGallery(document.getElementById('lightgallery'), {
			plugins: [lgZoom, lgThumbnail],
			speed: 500
		});
	});
</script>

<div
	id={galleryName}
	class="cursor-pointer w-full h-40 overflow-x-scroll overflow-y-hidden whitespace-nowrap"
>
	{#each pictures as picture}
		{#if !!picture.url}
			<a
				class="inline-block mr-2 h-full"
				data-lg-size={`${picture.width}-${picture.height}`}
				data-src={formatAssetUrl(picture.url)}
			>
				<img
					alt={picture.alternativeText}
					src={formatAssetUrl(picture.formats.small.url)}
					class="w-full h-full object-contain"
				/>
			</a>
		{/if}
	{/each}
</div>

<style>
	@import 'lightgallery/css/lightgallery.css';
	@import 'lightgallery/css/lg-zoom.css';
	@import 'lightgallery/css/lg-thumbnail.css';
</style>
