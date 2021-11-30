<script lang="ts">
	import Suspense from '$lib/components/suspense.svelte';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventuresBySportSlug } from '$lib/services/sportService';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';

	let getAdventuresPromise;

	const updateAdventures = async (pageValue) => {
		getAdventuresPromise = getAdventuresBySportSlug(pageValue.params.sportSlug);
	};

	const unsubscribe = page.subscribe(updateAdventures);
	onDestroy(unsubscribe);
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
				<SmallCover {adventure} />
			{/each}
		</div>
	</div>
</Suspense>
