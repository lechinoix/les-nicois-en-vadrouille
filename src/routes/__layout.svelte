<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Header from '$lib/components/newHeader/index.svelte';
</script>

<main>
	<Header />
	<div class="pb-14">
		<slot />
	</div>
</main>

<footer />

<style>
	@import '@themesberg/flowbite/dist/flowbite.min.css';

	@font-face {
		font-family: 'abadi-extra-light';

		src: url('/fonts/abadi-mt-std-extra-light.otf') format('otf');
	}

	:global(.font-title) {
		font-family: 'abadi-extra-light' sans-serif;
	}
</style>
