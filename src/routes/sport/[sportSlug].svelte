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
	import type { Sport } from '$lib/types';
	import { getSportBySlug } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { AdventureStatus, CoverTypes } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/coverTypes/largeCover.svelte';

	export let sport: Sport;
</script>

{#if sport?.cover_picture}
	<LargeCover
		picture={sport.cover_picture.picture}
		position={sport.cover_picture.position}
		title={sport.name}
	/>
{/if}
<div class="flex justify-center">
	<div
		class="
			inline-grid
			xl:grid-cols-3 md:grid-cols-2 grid-cols-1
			grid-flow-row gap-5 justify-self-auto
			m-5"
	>
		{#each sport.adventures as adventure}
			{#if adventure.status === AdventureStatus.DONE}
				<AdventureCover {adventure} coverType={CoverTypes.SMALL} />
			{/if}
		{/each}
	</div>
</div>
