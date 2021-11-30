<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import '../global.postcss';
	import Header from '$lib/components/newHeader/index.svelte';
</script>

<main>
	<Header />
	<div class="pb-14">
		<slot />
	</div>
</main>

<footer />
