<script context="module">
	import { getAllSports } from '$lib/services/sportService';

	export const prerender = true;
	export async function load({ fetch }) {
		let sports = await getAllSports(fetch);

		return {
			props: { sports },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import '../global.postcss';
	import type { Sport } from '$lib/types';
	import Header from '$lib/components/newHeader/index.svelte';

	export let sports: Sport[];
</script>

<svelte:head>
	<title>Les Niçois en Vadrouille</title>
</svelte:head>

<main>
	<Header {sports} />
	<div class="pb-14">
		<slot />
	</div>
</main>

<footer />
