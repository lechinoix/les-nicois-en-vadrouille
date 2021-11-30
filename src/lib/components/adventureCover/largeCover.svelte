<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Adventure, Picture } from '$lib/types';

	export let adventure: Adventure;

	let picture = adventure.cover_picture?.picture || adventure.pictures[0];
	let position = adventure.cover_picture?.position;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;
</script>

<div class="absolute w-full h-full flex justify-center">
	<strong
		class="
				block text-white font-bold text-5xl text-center
				py-3 px-2 self-center
				bg-gray-900 bg-opacity-10 bg-clip-border
				border-t-2 border-b-2 border-white
			"
	>
		{adventure.title}
	</strong>
</div>
<img
	class="w-screen max-w-full object-cover {getCoverPositionStyle(position)}"
	src={chooseFormatUrlFromPicture(picture)}
	alt={picture.alternativeText}
/>
