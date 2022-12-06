<script lang="ts">
	import type { PicturePosition } from '$lib/constants';

	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	export let picture: Picture | null;
	export let position: PicturePosition | null = null;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<div class="relative w-full flex bg-gray-400 min-h-80 h-1/3 max-h-140">
	<div class="absolute w-full h-full flex justify-end pb-8 pr-10 bg-gray-900 bg-opacity-10">
		<strong class="block text-white text-4xl text-right font-light self-end">
			Bienvenue sur notre blog d'aventures Outdoor
		</strong>
	</div>
	{#if picture}
		<img
			class="w-full max-w-full object-cover {getCoverPositionStyle(position)}"
			src={chooseFormatUrlFromPicture(picture)}
		/>
	{/if}
</div>

<style>
	.max-h-140 {
		max-height: 35rem;
	}

	.min-h-80 {
		min-height: 20rem;
	}
</style>
