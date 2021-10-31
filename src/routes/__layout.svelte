<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!browser) return;
		await import('@themesberg/flowbite/dist/flowbite.bundle');
	});
</script>

<main>
	<Header />
	<slot />
</main>

<footer />

<style>
	@import '@themesberg/flowbite/dist/flowbite.min.css';
</style>
