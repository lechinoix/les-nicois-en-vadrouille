<script context="module">
	import { getAllSports } from '$lib/services/sportService';

	export const prerender = true;
	export async function load({ fetch }) {
		let sports = await getAllSports(fetch);

		return {
			props: { sports }
		};
	}
</script>

<script lang="ts">
	import '../global.postcss';
	import type { Sport } from '$lib/types';
	import Header from '$lib/components/newHeader/index.svelte';
	import { DEFAULT_TITLE } from '$lib/constants';

	export let sports: Sport[];
</script>

<svelte:head>
	<title>{DEFAULT_TITLE}</title>
</svelte:head>

<main>
	<Header {sports} />
	<div class="pb-14"><slot /></div>
</main>

<footer />

<style>
	:root {
		scroll-behavior: auto;
	}
</style>
