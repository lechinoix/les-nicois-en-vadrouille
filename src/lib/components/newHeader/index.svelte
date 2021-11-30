<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ROUTES } from '$lib/config/routes';
	import { getAllSports } from '$lib/services/sportService';
	import PictoSport from '../picto/pictoSport.svelte';
	import BurgerIcon from './burgerIcon.svelte';

	let isOpen = false;
	let getSportsPromise = getAllSports();

	const openMenu = (event: any) => {
		if (!isOpen) event.stopPropagation();
		isOpen = true;
	};
	const closeMenu = () => {
		isOpen = false;
	};
</script>

<svelte:body on:click={closeMenu} />

<nav
	class="absolute bg-linear-b-w pt-5 flex items-start z-10 mx-auto w-screen px-10 justify-between"
>
	<a href={ROUTES.HOME} class="block">
		<span class="text-2xl text-white font-title font-extralight whitespace-nowrap">
			Our Little Adventures
		</span>
	</a>
	<div class="flex flex-col items-end">
		<BurgerIcon {isOpen} onClick={openMenu} ratio={3} />
		{#if isOpen}
			{#await getSportsPromise}
				<div />
			{:then sports}
				<div transition:slide class="pt-3">
					{#each sports as sport}
						<a
							href={`/sport/${sport.slug}`}
							class="flex text-white block px-4 py-2 text-sm justify-start items-center"
							role="menuitem"
							tabindex="-1"
						>
							<div class="w-7 h-7 rounded-full border border-white p-1 flex justify-center mr-2">
								<PictoSport sport={sport.slug} fill="white" />
							</div>
							<p>{sport.name}</p>
						</a>
					{/each}
				</div>
			{/await}
		{/if}
	</div>
</nav>

<style>
	.bg-linear-b-w {
		background: linear-gradient(rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0));
	}
</style>
