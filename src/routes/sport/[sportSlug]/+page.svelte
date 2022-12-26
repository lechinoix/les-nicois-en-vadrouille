<script lang="ts">
	import type { AdventureData, Sport } from '$lib/types';
	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import { CoverTypes, PicturePosition } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/largeCover.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';
	import { getAdventureDataBySportSlug } from '$lib/services/adventureService';
	import type { PageData } from './$types';

	export let data: PageData;

	$: sportTiles = getAdventureDataBySportSlug(data.sport.slug)
		.sort(
			(a: AdventureData, b: AdventureData) =>
				new Date(b.date).getTime() - new Date(a.date).getTime()
		)
		.map((adventure) => ({
			component: AdventureCover,
			props: { adventure, coverType: CoverTypes.SMALL },
			key: `${adventure.id}`
		}));
</script>

<svelte:head>
	{#if data.sport.cover}
		<meta property="og:image" content={data.sport.cover.formats.medium.url} />
	{/if}
	<meta property="og:title" content={data.sport.name} />
	<meta property="og:description" content={`Toutes les sorties de ${data.sport.name}`} />
</svelte:head>

{#if data.sport?.cover}
	<LargeCover
		picture={data.sport.cover}
		position={data.sport.cover?.position
			? // @ts-ignore
			  PicturePosition[data.sport.cover.position]
			: PicturePosition.CENTER}
		title={data.sport.name}
	/>
{/if}
<div class="my-7 mx-5 lg:mx-12 lg:my-10">
	<ResponsiveGrid items={sportTiles} />
</div>
