<script>
	import { fade } from 'svelte/transition';
	import Loader from '$lib/components/loader.svelte';

	const DISPLAY_LOADER_KEY = 'DISPLAY_LOADER';

	export let fadeDuration = 400;
	export let waitBeforeLoader = 500;
	export let showLoaderDuration = 1000;
	export let contentPromise;

	let pageVisible = true;
	let showLoader = false;

	$: pageContentPromise = Promise.race([
		new Promise((resolve) => setTimeout(() => resolve(DISPLAY_LOADER_KEY), waitBeforeLoader)),
		contentPromise
	]).then((result) => {
		if (result === DISPLAY_LOADER_KEY) {
			showLoader = true;

			return Promise.all([
				contentPromise,
				new Promise((resolve) => setTimeout(resolve, showLoaderDuration))
			]).then(([adventure]) => adventure);
		}

		return result;
	});
</script>

{#await pageContentPromise}
	{#if showLoader}
		<div
			transition:fade={{ duration: fadeDuration }}
			on:introstart={() => (pageVisible = false)}
			on:outroend={() => ((showLoader = false), (pageVisible = true))}
			class="w-full h-full flex justify-center items-center"
		>
			<slot name="loader">
				<Loader />
			</slot>
		</div>
	{/if}
{:then content}
	{#if !showLoader}
		<slot name="content" {content} />
	{:else if pageVisible}
		<div in:fade={{ duration: fadeDuration }}>
			<slot name="content" {content} />
		</div>
	{/if}
{:catch}
	<slot name="error">Something wrong happened...</slot>
{/await}
