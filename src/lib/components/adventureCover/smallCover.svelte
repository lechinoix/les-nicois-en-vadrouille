<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import CoverContainer from './index.svelte';

	export let adventure: Adventure;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.medium ? picture.formats.medium.url : picture.url;
</script>

<CoverContainer
	{adventure}
	renderTitle={(title) => `
		<div
      class="
        absolute w-full h-full
        opacity-0 hover:opacity-100
        flex justify-center
        bg-gray-900 bg-opacity-10
        px-5
      "
    >
			<strong class="block text-white font-bold text-2xl text-center self-center">
				${title}
			</strong>
		</div>
	`}
	renderImage={(picture, coverStyle) => `
		<img
			class="object-cover ${coverStyle} min-h-full"
			src="${chooseFormatUrlFromPicture(picture)}"
			alt="${picture.alternativeText}"
		/>
	`}
/>
