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
	<div class="container mx-auto px-4">
		<Header />
		<slot />
	</div>
</main>

<footer />

<style>
	@import '@themesberg/flowbite/dist/flowbite.min.css';
</style>
