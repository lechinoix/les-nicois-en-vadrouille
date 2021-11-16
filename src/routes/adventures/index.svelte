<script lang="ts">
	import { getAdventuresDone } from '$lib/services/adventureService';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import Loader from '$lib/components/loader.svelte';
	import Description from '$lib/components/description.svelte';

	let adventuresPromise = getAdventuresDone();
</script>

{#await adventuresPromise}
	<Loader />
{:then adventures}
	{#each adventures as adventure}
		<AdventureCard {adventure}>
			<Description className="pt-7">
				{adventure.short_description || truncateText(adventure.description)}
			</Description>
		</AdventureCard>
	{/each}
{:catch error}
	{error}
{/await}
