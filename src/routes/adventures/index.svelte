<script lang="typescript">
	import { onMount } from 'svelte';
	import { formatAssetUrl, getAdventures } from '$lib/services/adventureService'
	import type { Adventure } from '$lib/types';

	let adventures: Adventure[] = [];
	let error = null

	onMount(async () => {
		try {
			adventures = await getAdventures()
		} catch (e) {
			error = e
		}
	});

	</script>
	{#if error !== null}
		{error}
	{:else}
	<div class="container">
		<h1>Our Little Adventures</h1>
		<div class="row">
			{#each adventures as adventure}
				<div class="column one-half">
					{#if adventure.pictures.length > 0}
					<img
						src="{formatAssetUrl(adventure.pictures[0].formats.small.url)}"
						alt="{adventure.pictures[0].alternativeText}" />
					{/if}
					<h3>{adventure.title}</h3>
					<p>
						<b>Date</b> : {adventure.date} <br />
						<b>Cotation</b> : {adventure.cotation} <br />
						<b>Sports</b> : {adventure.sports.reduce((acc, el) => `${acc} ${el.name}`, '')} <br />
						<b>Description</b> : {adventure.description} <br />
					</p>
				</div>
			{/each}
		</div>
	</div>
	{/if}