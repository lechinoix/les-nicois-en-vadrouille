<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import CoverContainer from './index.svelte';

	export let adventure: Adventure;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<CoverContainer
	{adventure}
	renderOverlay={(title) => `
		<div class="absolute w-full h-full flex justify-center">
			<strong
				class="
				block text-white font-bold text-5xl text-center
				py-3 px-2 self-center
				bg-gray-900 bg-opacity-10 bg-clip-border
				border-t-2 border-b-2 border-white
			"
			>
				${title}
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
