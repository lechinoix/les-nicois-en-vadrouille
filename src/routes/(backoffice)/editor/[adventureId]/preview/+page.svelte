<script lang="ts">
	import AdventurePage from '$lib/components/adventures/adventurePage.svelte';
	import type { Adventure } from '$lib/types';
	import type { PageData } from './$types';
	import { getDraft } from '$lib/services/contentCreationService';
	import { onMount } from 'svelte';

	export let data: PageData;

	let adventure: Adventure;

	const updateAdventure = () => {
		const draft = getDraft(data.adventureId);
		if (!draft) return;
		adventure = draft;
	};

	onMount(() => {
		updateAdventure();
	});
</script>

<svelte:window on:storage={updateAdventure} />

{#if adventure}
	<AdventurePage {adventure} />
{/if}
