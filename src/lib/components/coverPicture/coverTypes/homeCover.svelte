<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	export let picture: Picture;
	export let position: string = '';

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<div class="relative w-screen flex bg-gray-400 min-h-80 h-1/3 max-h-140">
	<div class="absolute w-full h-full flex justify-end pb-8 pr-10 bg-gray-900 bg-opacity-10">
		<strong class="block text-white text-3xl text-right font-title font-light self-end">
			Bienvenue sur le blog d'aventures
			<br />
			d'Ambre et Nico !
		</strong>
	</div>
	<img
		class="w-screen max-w-full object-cover {getCoverPositionStyle(position)}"
		src={chooseFormatUrlFromPicture(picture)}
		alt={picture.alternativeText}
	/>
</div>

<style>
	.max-h-140 {
		max-height: 35rem;
	}

	.min-h-80 {
		min-height: 20rem;
	}
</style>
