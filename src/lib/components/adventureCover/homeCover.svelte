<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Adventure, Picture } from '$lib/types';

	export let adventure: Adventure;

	let picture = adventure.cover_picture?.picture || adventure.pictures[0];
	let position = adventure.cover_picture?.position;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<div class="relative w-screen flex bg-gray-400 h-112">
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
	.h-112 {
		height: 28rem;
	}
</style>
