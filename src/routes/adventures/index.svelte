<script>
	import { onMount } from 'svelte';
	import config from '../../config'

	let adventures = [];
	let error = null

	onMount(async () => {
		try {
			const res = await fetch(`${config.BASE_API_URL}/adventures`);
			adventures = await res.json()
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