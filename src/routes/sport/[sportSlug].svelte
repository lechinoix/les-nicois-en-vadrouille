<script context="module">
	export const prerender = true;
	export async function load({ page, fetch }) {
		const sport = await getSportBySlug(fetch, page.params.sportSlug);
		return {
			props: { sport },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import type { Adventure, ResponsiveItem, Sport } from '$lib/types';
	import { getSportBySlug } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { AdventureStatus, CoverTypes } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/coverTypes/largeCover.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';

	export let sport: Sport;

	let sportTiles: ResponsiveItem<{ adventure: Adventure; coverType: string }>[];

	$: sportTiles = sport.adventures
		.filter((adventure) => adventure.status === AdventureStatus.DONE)
		.map((adventure) => ({
			component: AdventureCover,
			props: { adventure, coverType: CoverTypes.SMALL },
			key: `${adventure.id}`
		}));
</script>

{#if sport?.cover_picture}
	<LargeCover
		picture={sport.cover_picture.picture}
		position={sport.cover_picture.position}
		title={sport.name}
	/>
{/if}
<div class="my-7 mx-5 lg:mx-12 lg:my-10">
	<ResponsiveGrid items={sportTiles} />
</div>
