<script lang="ts">
	import { getAdventuresDone } from '$lib/services/adventureService';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import Description from '$lib/components/description.svelte';
	import Suspense from '$lib/components/suspense.svelte';

	let adventuresPromise = getAdventuresDone();
</script>

<Suspense contentPromise={adventuresPromise}>
	<div slot="content" let:content={adventures}>
		{#each adventures as adventure}
			<AdventureCard {adventure}>
				<Description className="pt-7">
					{adventure.short_description || truncateText(adventure.description)}
				</Description>
			</AdventureCard>
		{/each}
	</div>
</Suspense>
