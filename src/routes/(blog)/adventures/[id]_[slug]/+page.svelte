<script lang="ts">
	import AdventurePage from '$lib/components/adventures/adventurePage.svelte';
	import type { PageData } from './$types';
	import { slugify, truncateText } from '$lib/utils/string';
	import { getUrlWithNewSlug } from '$lib/utils/url';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getCoverPicture } from '$lib/services/adventureService';

	export let data: PageData;

	let pageUrl: string;
	let adventureSlug: string;
	$: {
		adventureSlug = slugify(data.adventure.title);
		if (browser) pageUrl = getUrlWithNewSlug(location, adventureSlug);
		if (browser && $page.params.slug !== adventureSlug)
			window.history.replaceState(null, '', pageUrl);
	}
	$: coverPicture = getCoverPicture(data.adventure);
</script>

<svelte:head>
	{#if coverPicture}
		<meta property="og:image" content={coverPicture.formats.medium.url} />
	{/if}
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={data.adventure.title} />
	<meta property="og:description" content={truncateText(data.adventure.content)} />
</svelte:head>

<AdventurePage adventure={data.adventure} />
