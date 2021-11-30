<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import CoverContainer from './index.svelte';

	export let adventure: Adventure;

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
	<CoverContainer {adventure}>
		<div
			slot="overlay"
			let:title
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
			slot="picture"
			let:picture
			let:addedStyle={coverStyle}
			class="object-cover {coverStyle} min-h-full"
			src={chooseFormatUrlFromPicture(picture)}
			alt={picture.alternativeText}
		/>
	</CoverContainer>
</a>
