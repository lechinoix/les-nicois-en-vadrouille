<script lang="ts">
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/config/routes';
	import { getAllSports } from '$lib/services/sportService';
	import type { Sport } from '$lib/types';
	import PictoSport from '../picto/pictoSport.svelte';
	import { iconFillColor } from '$lib/constants';
	import BurgerIcon from './burgerIcon.svelte';
	import Loader from '../loader.svelte';

	let isOpen = false;
	let getSportsPromise: Promise<Sport[]>;

	const openMenu = (event: any) => {
		if (!isOpen) event.stopPropagation();
		isOpen = true;
	};
	const closeMenu = () => {
		isOpen = false;
	};

	onMount(() => {
		getSportsPromise = getAllSports();
	});
</script>

<svelte:body on:click={closeMenu} />

<nav class="fixed bg-linear-b-w h-20 flex items-center z-10 mx-auto w-screen px-10 justify-between">
	<a href={ROUTES.HOME} class="block">
		<span class="text-2xl text-white font-title font-extralight whitespace-nowrap">
			Our Little Adventures
		</span>
	</a>
	<BurgerIcon {isOpen} onClick={openMenu} ratio={3} />
	{#if isOpen}
		<div>
			{#await getSportsPromise}
				<Loader />
			{:then sports}
				{#each sports as sport}
					<a
						href={`/sport/${sport.slug}`}
						class="flex text-gray-700 block px-4 py-2 text-sm justify-start items-center hover:bg-gray-100"
						role="menuitem"
						tabindex="-1"
					>
						<div class="w-7 h-7 rounded-full border border-gray-300 p-1 flex justify-center mr-2">
							<PictoSport sport={sport.slug} fill={iconFillColor} />
						</div>
						<p>{sport.name}</p>
					</a>
				{/each}
			{/await}
		</div>
	{/if}
</nav>

<style>
	.bg-linear-b-w {
		background: linear-gradient(rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0));
	}
</style>
