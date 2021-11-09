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
	<div class="pt-20 pb-14">
		<slot />
	</div>
</main>

<footer />

<style>
	@import '@themesberg/flowbite/dist/flowbite.min.css';
</style>
