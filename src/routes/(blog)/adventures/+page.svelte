<script lang="ts">
	import { ALL_ADVENTURES_COVER, CoverTypes, PicturePosition } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/largeCover.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';
	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let allAdventurePicture = ALL_ADVENTURES_COVER;

	$: allTiles = data.adventures.map((adventure) => ({
		component: AdventureCover,
		props: { adventure, coverType: CoverTypes.SMALL },
		key: `${adventure.id}`
	}));
</script>

<svelte:head>
	<meta property="og:image" content={allAdventurePicture.formats.medium.url} />
	<meta property="og:title" content="Nos aventures" />
	<meta property="og:description" content="La liste de toutes les aventures" />
</svelte:head>

<LargeCover
	picture={allAdventurePicture}
	position={PicturePosition.BOTTOM}
	title="Toutes les sorties"
/>

<div class="my-7 mx-5 lg:mx-12 lg:my-10">
	<ResponsiveGrid items={allTiles} />
</div>
