<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Picture } from '$lib/types';

	export let picture: Picture;
	export let position = null;
	export let href = '#';
	export let title = '';

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.medium ? picture.formats.medium.url : picture.url;
</script>

<a
	{href}
	class="
		block relative md:w-96 w-full h-52
		overflow-hidden bg-gray-300
	"
>
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
			{title}
		</strong>
	</div>
	<img
		class="object-cover {getCoverPositionStyle(position)} min-h-full"
		src={chooseFormatUrlFromPicture(picture)}
		alt={picture.alternativeText}
	/>
</a>
