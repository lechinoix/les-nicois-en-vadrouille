<script lang="ts">
	import type { PicturePosition } from '$lib/constants';

	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	export let picture: Picture | null;
	export let position: PicturePosition | null = null;
	export let href = '#';
	export let title = '';
	export let onClick: (() => void) | null = null;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.medium ? picture.formats.medium.url : picture.url;
</script>

<a
	{href}
	on:click={onClick}
	class="
		block relative w-full h-full
		overflow-hidden bg-gray-300
	"
>
	<div
		class="
				absolute w-full h-full
				flex justify-center
				bg-gray-900 bg-opacity-20
				px-5
			"
	>
		<strong class="block text-white font-bold text-2xl text-center self-center">
			{title}
		</strong>
	</div>
	{#if picture}
		<img
			class="object-cover {getCoverPositionStyle(position)} h-full w-full"
			src={chooseFormatUrlFromPicture(picture)}
			alt={picture.alternativeText}
		/>
	{/if}
</a>
