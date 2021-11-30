<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import '../../global.postcss';
</script>

<main>
	<Header />
	<div class="pt-20 pb-14">
		<slot />
	</div>
</main>

<footer />
