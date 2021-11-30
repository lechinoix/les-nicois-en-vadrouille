<script lang="ts">
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { page } from '$app/stores';
	import { getAdventureById } from '$lib/services/adventureService';
	import Description from '$lib/components/description.svelte';
	import Container from '$lib/components/container.svelte';
	import Suspense from '$lib/components/suspense.svelte';

	let adventurePromise = getAdventureById($page.params.id);
</script>

<Suspense contentPromise={adventurePromise}>
	<div slot="content" let:content={adventure}>
		<AdventureCard {adventure} />
		<Container>
			<Description>{@html marked(adventure.description)}</Description>
			<br />
			<br />
			{#if adventure.topo && adventure.topo.length > 0}
				<b>Topo</b> :
				{#each adventure.topo as topo}
					<TopoLink {topo} />
					<br />
				{/each}
			{/if}
			{#if adventure.pictures.length > 0}
				<div class="mt-5">
					<Slider pictures={adventure.pictures} />
				</div>
			{/if}
		</Container>
	</div>
</Suspense>
