<script lang="ts">
	import { HOMEPAGE_US_IMAGE_URL } from '$lib/constants';
	import { truncateText } from '$lib/utils/string';
	import AdventureCard from '$lib/components/adventures/adventureHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let latestAdventurePictureUrl = HOMEPAGE_US_IMAGE_URL;

	$: if (data.adventures?.length > 0 && data.adventures[0].cover)
		latestAdventurePictureUrl = data.adventures[0].cover.formats.medium.url;
</script>

<svelte:head>
	<meta property="og:image" content={latestAdventurePictureUrl} />
	<meta property="og:title" content="Nos aventures" />
	<meta property="og:description" content="La liste de toutes les aventures" />
</svelte:head>

{#each data.adventures as adventure}
	<AdventureCard {adventure}>
		<p class="text-justify text-gray-800 text-xl font-serif font-light leading-relaxed pt-7">
			{truncateText(adventure.content)}
		</p>
	</AdventureCard>
{/each}
