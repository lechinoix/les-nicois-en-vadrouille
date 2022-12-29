<script lang="ts">
	import Header from '$lib/components/newHeader/index.svelte';
	import { DEFAULT_TITLE } from '$lib/constants';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{DEFAULT_TITLE}</title>
</svelte:head>

<main>
	<Header sports={data.sports} />
	<div class="pb-14"><slot /></div>
</main>

<footer>
	
</footer>
