<script lang="ts">
	import { CoverTypes, PicturePosition } from '$lib/constants';
	import LargeCover from '../coverPicture/largeCover.svelte';
	import HomeCover from '../coverPicture/homeCover.svelte';
	import SmallCover from '../coverPicture/smallCover.svelte';
	import type { AdventureData, Picture } from '$lib/types';
	import { ROUTES } from '$lib/config/routes';
	import { slugify } from '$lib/utils/string';
	import { getCoverPicture } from '$lib/services/adventureService';

	const mapTypeToComponent = {
		[CoverTypes.LARGE]: LargeCover,
		[CoverTypes.HOME]: HomeCover,
		[CoverTypes.SMALL]: SmallCover
	};

	export let adventure: AdventureData;
	export let coverType: CoverTypes = CoverTypes.LARGE;
	export let onClick: (() => void) | null = null;

	let href: string | undefined;
	let position: PicturePosition;
	let picture: Picture | null;
	let title: string;

	// @ts-ignore
	$: position = PicturePosition[adventure.cover?.position ?? PicturePosition.CENTER.toString()];
	$: picture = getCoverPicture(adventure);
	$: title = adventure.title;

	$: href =
		onClick !== null
			? undefined
			: `${ROUTES.ADVENTURES.BY_ID}${adventure.id}_${slugify(adventure.title)}`;

	let coverTypeComponent = mapTypeToComponent[coverType];
</script>

<svelte:component this={coverTypeComponent} {picture} {position} {title} {href} {onClick} />
