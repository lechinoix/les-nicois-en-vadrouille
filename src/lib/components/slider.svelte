<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Picture } from '$lib/types';
	import { sliderRef } from '$lib/stores/slider';
	import isMobile from '$lib/utils/isMobile';

	export const ssr = false;
	export let pictures: Picture[] = [];
	export let galleryName: string = 'lightgallery';

	onMount(async () => {
		if (!browser) return;
		const { default: lightGallery } = await import('lightgallery');
		const { default: lgZoom } = await import('lightgallery/plugins/zoom/lg-zoom.umd');

		const plugins = [lgZoom];

		if (!isMobile()) {
			const { default: lgThumbnail } = await import(
				'lightgallery/plugins/thumbnail/lg-thumbnail.umd'
			);
			plugins.push(lgThumbnail);
		}

		const gallery = lightGallery(document.getElementById('lightgallery'), {
			plugins,
			speed: 500,
			mobileSettings: { showCloseIcon: true }
		});

		sliderRef.set(gallery);
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
				data-src={picture.url}
			>
				<img src={picture.formats.small.url} class="h-full object-contain" />
			</a>
		{/if}
	{/each}
</div>

<style>
	@import 'lightgallery/css/lightgallery.css';
	@import 'lightgallery/css/lg-zoom.css';
	@import 'lightgallery/css/lg-thumbnail.css';
</style>
