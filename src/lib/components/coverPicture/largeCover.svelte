<script lang="ts">
	import type { PicturePosition } from '$lib/constants';

	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	const EMPTY_HREF = '#';

	export let picture: Picture | null;
	export let position: PicturePosition | null = null;
	export let title = '';
	export let href = EMPTY_HREF;
	export let onClick: (() => void) | null = null;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<a
	{href}
	on:click={onClick}
	class={`relative w-full h-96 flex bg-gray-400 ${
		href === EMPTY_HREF && onClick !== null ? 'cursor-default' : 'cursor-pointer'
	}`}
>
	<div class="absolute w-full h-full flex justify-center">
		<strong
			class="
					block text-white text-5xl text-center
					py-3 px-2 self-center
					bg-gray-900 bg-opacity-10 bg-clip-border
					border-t-2 border-b-2 border-white
				"
		>
			{title}
		</strong>
	</div>
	{#if picture}
		<img
			class="w-full max-w-full object-cover {getCoverPositionStyle(position)}"
			src={chooseFormatUrlFromPicture(picture)}
			alt={picture.alternativeText}
		/>
	{/if}
</a>
