<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { PicturePosition } from '$lib/constants';

	const DEFAULT_POSITION = 'object-center';

	const postitionToStyle = {
		[PicturePosition.CENTER]: DEFAULT_POSITION,
		[PicturePosition.BOTTOM]: 'object-bottom',
		[PicturePosition.LEFT]: 'object-left',
		[PicturePosition.BOTTOM_LEFT]: 'object-left-bottom',
		[PicturePosition.TOP_LEFT]: 'object-left-top',
		[PicturePosition.RIGHT]: 'object-right',
		[PicturePosition.BOTTOM_RIGHT]: 'object-right-bottom',
		[PicturePosition.TOP_RIGHT]: 'object-right-top',
		[PicturePosition.TOP]: 'object-top'
	};

	export let adventure: Adventure;

	const getCoverPictureFromAdventure = (adventure: Adventure) => {
		if (adventure?.cover_picture?.picture) return adventure.cover_picture.picture;
		if (adventure.pictures.length !== 0) return adventure.pictures[0];
		return null;
	};

	const getCoverPositionStyle = (adventure: Adventure) => {
		if (!adventure?.cover_picture?.position) return DEFAULT_POSITION;
		return postitionToStyle[adventure.cover_picture.position];
	};
</script>

<slot name="overlay" title={adventure.title} />
<slot
	name="picture"
	picture={getCoverPictureFromAdventure(adventure)}
	addedStyle={getCoverPositionStyle(adventure)}
/>
