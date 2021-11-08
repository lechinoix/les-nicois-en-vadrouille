<script lang="ts">
	import type { Adventure, Picture } from '$lib/types';
	import { PicturePosition } from '$lib/constants';

	const postitionToStyle = {
		[PicturePosition.BOTTOM]: 'object-bottom',
		[PicturePosition.CENTER]: 'object-center',
		[PicturePosition.LEFT]: 'object-left',
		[PicturePosition.BOTTOM_LEFT]: 'object-left-bottom',
		[PicturePosition.TOP_LEFT]: 'object-left-top',
		[PicturePosition.RIGHT]: 'object-right',
		[PicturePosition.BOTTOM_RIGHT]: 'object-right-bottom',
		[PicturePosition.TOP_RIGHT]: 'object-right-top',
		[PicturePosition.TOP]: 'object-top'
	};

	export let adventure: Adventure;

	const chooseFormatUrlFromPicture = (picture: Picture) =>
		picture.formats.xlarge ? picture.formats.xlarge.url : picture.url;

	const getCoverPictureFromAdventure = (adventure: Adventure) => {
		if (adventure?.cover_picture?.picture) return adventure.cover_picture.picture;
		if (adventure.pictures.length === 0) return adventure.pictures[0];
		return null;
	};

	const getCoverUrlFromAdventure = (adventure: Adventure) => {
		return chooseFormatUrlFromPicture(getCoverPictureFromAdventure(adventure));
	};

	const getCoverPositionStyle = (adventure: Adventure) => {
		if (!adventure?.cover_picture?.position) return '';
		return postitionToStyle[adventure.cover_picture.position];
	};
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
{#if !!getCoverPictureFromAdventure(adventure)}
	<img
		class={`w-screen max-w-full object-cover ${getCoverPositionStyle(adventure)}`}
		src={getCoverUrlFromAdventure(adventure)}
		alt={getCoverPictureFromAdventure(adventure).alternativeText}
	/>
{/if}
