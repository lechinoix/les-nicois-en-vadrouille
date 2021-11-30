<script lang="ts">
	import Suspense from '$lib/components/suspense.svelte';
	import { page } from '$app/stores';
	import { getAdventuresBySportSlug } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { CoverTypes } from '$lib/constants';

	let getAdventuresPromise = getAdventuresBySportSlug($page.params.sportSlug);
</script>

<Suspense contentPromise={getAdventuresPromise}>
	<div slot="content" let:content={adventures} class="flex justify-center">
		<div
			class="
				inline-grid
				xl:grid-cols-3 md:grid-cols-2 grid-cols-1
				grid-flow-row gap-5 justify-self-auto
				m-5"
		>
			{#each adventures as adventure}
				<AdventureCover {adventure} coverType={CoverTypes.SMALL} />
			{/each}
		</div>
	</div>
</Suspense>
