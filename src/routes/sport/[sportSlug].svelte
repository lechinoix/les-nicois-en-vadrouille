<script lang="ts">
	import Suspense from '$lib/components/suspense.svelte';
	import { page } from '$app/stores';
	import { getSportBySlug } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { AdventureStatus, CoverTypes } from '$lib/constants';
	import LargeCover from '$lib/components/coverPicture/coverTypes/largeCover.svelte';

	let getSportPromise = getSportBySlug($page.params.sportSlug);
</script>

<Suspense contentPromise={getSportPromise}>
	<div slot="content" let:content={sport}>
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
	</div>
</Suspense>
