<script>
	import { fade } from 'svelte/transition';
	import Loader from '$lib/components/loader.svelte';

	const DISPLAY_LOADER_KEY = 'DISPLAY_LOADER';

	export let contentPromise;
	let pageVisible = true;
	let showLoader = false;

	let pageContentPromise = Promise.race([
		new Promise((resolve) => setTimeout(() => resolve(DISPLAY_LOADER_KEY), 400)),
		contentPromise
	]).then((result) => {
		if (result === DISPLAY_LOADER_KEY) {
			showLoader = true;

			return Promise.all([
				contentPromise,
				new Promise((resolve) => setTimeout(resolve, 1000))
			]).then(([adventure]) => adventure);
		}

		return result;
	});
</script>

{#await pageContentPromise}
	{#if showLoader}
		<div
			transition:fade={{ duration: 400 }}
			on:introstart={() => (pageVisible = false)}
			on:outroend={() => (pageVisible = true)}
			class="w-screen h-screen flex justify-center items-center"
		>
			<slot name="loader">
				<Loader />
			</slot>
		</div>
	{/if}
{:then content}
	{#if pageVisible}
		<div in:fade={{ duration: 500 }}>
			<slot name="content" {content} />
		</div>
	{/if}
{:catch}
	<slot name="error">Something wrong happened...</slot>
{/await}
