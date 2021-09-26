<script lang="ts">
	import { onMount } from 'svelte';
	import { getAdventures } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import TopoLink from '$lib/components/topoLink.svelte';

	let adventures: Adventure[] = [];
	let error = null;

	onMount(async () => {
		try {
			adventures = await getAdventures();
		} catch (e) {
			error = e;
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
					<a href={`/adventures/${adventure.id}`}>
						<h3>{adventure.title}</h3>
						<p>
							<b>Date</b> : {adventure.date} <br />
							<b>Sports</b> : {adventure.sports.reduce((acc, el) => `${acc} ${el.name}`, '')} <br />
							<b>Topo</b> : {#each adventure.topo as topo}
								<TopoLink {topo} />
								<br />
							{/each}
						</p>
					</a>
				</div>
			{/each}
		</div>
	</div>
{/if}
