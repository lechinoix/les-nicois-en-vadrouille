<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	const EMPTY_HREF = '#';

	export let picture: Picture;
	export let position = null;
	export let title = '';
	export let href = EMPTY_HREF;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<a
	{href}
	class={`relative w-screen h-96 flex bg-gray-400 ${href === EMPTY_HREF ? 'cursor-default' : ''}`}
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
	<img
		class="w-screen max-w-full object-cover {getCoverPositionStyle(position)}"
		src={chooseFormatUrlFromPicture(picture)}
		alt={picture.alternativeText}
	/>
</a>
