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
	export let renderTitle: (title: string) => string;
	export let renderImage: (picture: Picture, coverStyle: string) => string;

	const getCoverPictureFromAdventure = (adventure: Adventure) => {
		if (adventure?.cover_picture?.picture) return adventure.cover_picture.picture;
		if (adventure.pictures.length !== 0) return adventure.pictures[0];
		return null;
	};

	const getCoverPositionStyle = (adventure: Adventure) => {
		if (!adventure?.cover_picture?.position) return '';
		return postitionToStyle[adventure.cover_picture.position];
	};
</script>

{@html renderTitle(adventure.title)}
{#if !!getCoverPictureFromAdventure(adventure)}
	{@html renderImage(getCoverPictureFromAdventure(adventure), getCoverPositionStyle(adventure))}
{/if}
