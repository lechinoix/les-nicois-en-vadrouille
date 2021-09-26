<script lang="typescript">
  import Slider from '$lib/components/slider.svelte'
	import { onMount } from 'svelte';
  import { page } from '$app/stores';
	import { getAdventureById } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';

	let adventure: Adventure = null;
	let error = null

	onMount(async () => {
		try {
      console.log(page)
			adventure = await getAdventureById($page.params.id)
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
      {#if adventure === null}
        <p>Loading...</p>
      {:else}
        {#if adventure.pictures.length > 0}
          <Slider pictures={adventure.pictures} />
        {/if}
        <h3>{adventure.title}</h3>
        <p>
          <b>Date</b> : {adventure.date} <br />
          <b>Cotation</b> : {adventure.cotation} <br />
          <b>Sports</b> : {adventure.sports.reduce((acc, el) => `${acc} ${el.name}`, '')} <br />
          <b>Description</b> : {adventure.description} <br />
        </p>
      {/if}
    </div>
	{/if}