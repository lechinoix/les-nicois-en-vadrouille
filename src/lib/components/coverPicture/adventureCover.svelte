<script lang="ts">
	import { CoverTypes } from '$lib/constants';
	import LargeCover from './coverTypes/largeCover.svelte';
	import HomeCover from './coverTypes/homeCover.svelte';
	import SmallCover from './coverTypes/smallCover.svelte';
	import type { Adventure } from '$lib/types';

	const mapTypeToComponent = {
		[CoverTypes.LARGE]: LargeCover,
		[CoverTypes.HOME]: HomeCover,
		[CoverTypes.SMALL]: SmallCover
	};

	export let adventure: Adventure;
	export let coverType: CoverTypes = CoverTypes.LARGE;
	export let withLink = true;

	let position = adventure.cover_picture?.position;
	let picture = adventure.cover_picture?.picture || adventure.pictures[0];
	let title = adventure.title;
	let href = withLink ? `/adventures/${adventure.id}` : null;

	let coverTypeComponent = mapTypeToComponent[coverType];
</script>

<svelte:component this={coverTypeComponent} {picture} {position} {title} {href} />
