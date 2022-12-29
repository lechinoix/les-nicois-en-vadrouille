<script lang="ts">
	import Header from '$lib/components/newHeader/index.svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { DEFAULT_TITLE } from '$lib/constants';
	import { checkIsLoggedIn } from '$lib/services/secretsService';
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

{#if checkIsLoggedIn()}
	<footer class="fixed flex bg-white h-14 items-center justify-start bottom-0 px-3 py-5">
		<LinkButton url="/editor">Go to Editor</LinkButton>
	</footer>
{/if}
