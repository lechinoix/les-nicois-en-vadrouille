<script context="module" lang="ts">
	import type { LoadInput } from '@sveltejs/kit';

	export const prerender = true;
	export async function load({ page }: LoadInput) {
		const sport = await getSportBySlug(page.params.sportSlug);
		return {
			props: { sport }
		};
	}
</script>

<script lang="ts">
	import type { AdventureData, Sport } from '$lib/types';
	import { getSportBySlug } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import { CoverTypes, PicturePosition } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/largeCover.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';
	import { getAdventureDataBySportSlug } from '$lib/services/adventureService';

	export let sport: Sport;

	$: sportTiles = getAdventureDataBySportSlug(sport.slug)
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
	{#if sport.cover}
		<meta property="og:image" content={sport.cover.formats.medium.url} />
	{/if}
	<meta property="og:title" content={sport.name} />
	<meta property="og:description" content={`Toutes les sorties de ${sport.name}`} />
</svelte:head>

{#if sport?.cover}
	<LargeCover
		picture={sport.cover}
		position={sport.cover?.position
			? // @ts-ignore
			  PicturePosition[sport.cover.position]
			: PicturePosition.CENTER}
		title={sport.name}
	/>
{/if}
<div class="my-7 mx-5 lg:mx-12 lg:my-10">
	<ResponsiveGrid items={sportTiles} />
</div>
