<script lang="ts">
	import { CoverTypes } from '$lib/constants';
	import LargeCover from './coverTypes/largeCover.svelte';
	import HomeCover from './coverTypes/homeCover.svelte';
	import SmallCover from './coverTypes/smallCover.svelte';
	import type { Adventure } from '$lib/types';
	import { ROUTES } from '$lib/config/routes';
	import { slugify } from '$lib/utils/string';

	const mapTypeToComponent = {
		[CoverTypes.LARGE]: LargeCover,
		[CoverTypes.HOME]: HomeCover,
		[CoverTypes.SMALL]: SmallCover
	};

	export let adventure: Adventure;
	export let coverType: CoverTypes = CoverTypes.LARGE;
	export let onClick: () => void | null = null;

	let href;
	let position = adventure.cover_picture?.position;
	let picture = adventure.cover_picture?.picture || adventure.pictures[0];
	let title = adventure.title;

	$: href =
		onClick !== null
			? null
			: `${ROUTES.ADVENTURES.BY_ID}${adventure.id}_${slugify(adventure.title)}`;

	let coverTypeComponent = mapTypeToComponent[coverType];
</script>

<svelte:component this={coverTypeComponent} {picture} {position} {title} {href} {onClick} />
