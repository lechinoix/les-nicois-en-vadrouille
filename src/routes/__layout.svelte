<script context="module">
	import { getAllSports } from '$lib/services/sportService';

	export const prerender = true;
	export async function load({ fetch }) {
		let sports = await getAllSports(fetch);

		return {
			props: { sports },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import '../global.postcss';
	import type { Sport } from '$lib/types';
	import Header from '$lib/components/newHeader/index.svelte';
	import Suspense from '$lib/components/suspense.svelte';
	import { getStores, Navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/env';

	export let sports: Sport[];

	const NAVIGATION_STATUSES = {
		FIRST_LOAD: 'FIRST_LOAD',
		LOADING: 'LOADING',
		LOADED: 'LOADED'
	};

	let navigationStatus = NAVIGATION_STATUSES.FIRST_LOAD;
	let ongoingNavigationPromise: Promise<void>;
	let resolveNavigationPromise: () => void;

	const startNavigation = () => {
		navigationStatus = NAVIGATION_STATUSES.LOADING;
		ongoingNavigationPromise = new Promise((resolve) => {
			resolveNavigationPromise = resolve;
		});
	};

	const endNavigation = () => {
		navigationStatus = NAVIGATION_STATUSES.LOADED;
		resolveNavigationPromise();
	};

	const handleNavigationPromise = (value: Navigating | null) => {
		if (!browser) return;

		if (value === null && navigationStatus === NAVIGATION_STATUSES.LOADING) {
			endNavigation();
		} else if (value !== null) {
			startNavigation();
		}
	};

	const unsubscribe = getStores().navigating.subscribe(handleNavigationPromise);
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Les Niçois en Vadrouille</title>
</svelte:head>

<main>
	<Header {sports} />
	<Suspense contentPromise={ongoingNavigationPromise}
		><div class="pb-14" slot="content"><slot /></div></Suspense
	>
</main>

<footer />
