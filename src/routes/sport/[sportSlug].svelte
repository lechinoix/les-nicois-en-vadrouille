<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getAdventuresBySportSlug } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import Loader from '$lib/components/loader.svelte';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';

	let adventures: Adventure[] = null;
	let error = null;

	onMount(async () => {
		try {
			adventures = await getAdventuresBySportSlug($page.params.sportSlug);
			console.log(adventures);
		} catch (e) {
			error = e;
		}
	});
</script>

{#if error !== null}
	{error}
{:else if adventures === null}
	<Loader />
{:else}
	{#each adventures as adventure}
		<SmallCover {adventure} />
	{/each}
{/if}
