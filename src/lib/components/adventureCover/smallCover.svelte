<script lang="ts">
	import { getCoverPositionStyle } from '$lib/services/coverPictureService';
	import type { Adventure, Picture } from '$lib/types';

	export let adventure: Adventure;

	let picture = adventure.cover_picture?.picture || adventure.pictures[0];
	let position = adventure.cover_picture?.position;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.medium ? picture.formats.medium.url : picture.url;
</script>

<a
	href={`/adventures/${adventure.id}`}
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
			{adventure.title}
		</strong>
	</div>
	<img
		class="object-cover {getCoverPositionStyle(position)} min-h-full"
		src={chooseFormatUrlFromPicture(picture)}
		alt={picture.alternativeText}
	/>
</a>
