<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import CoverContainer from './index.svelte';

	export let adventure: Adventure;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<div class="relative w-screen flex bg-gray-400 h-112">
	<CoverContainer
		{adventure}
		renderOverlay={(title) => `
			<div class="absolute w-full h-full flex justify-end pb-8 pr-10 bg-gray-900 bg-opacity-10">
				<strong
					class="block text-white text-3xl text-right font-title font-light self-end"
				>
					Bienvenue sur le blog d'aventures
					<br />
					d'Ambre et Nico !
				</strong>
			</div>
		`}
		renderImage={(picture, coverStyle) => `
			<img
				class="w-screen max-w-full object-cover ${coverStyle}"
				src="${chooseFormatUrlFromPicture(picture)}"
				alt="${picture.alternativeText}"
			/>
		`}
	/>
</div>

<style>
	.h-112 {
		height: 28rem;
	}
</style>
