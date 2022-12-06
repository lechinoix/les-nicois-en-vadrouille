<script lang="ts">
	import type { Sport } from '$lib/types';
	import { slide } from 'svelte/transition';
	import { ROUTES } from '$lib/config/routes';
	import BurgerIcon from './burgerIcon.svelte';
	import { getAdventureDataBySportSlug } from '$lib/services/adventureService';

	export let sports: Sport[];

	let isOpen = false;

	const openMenu = (event: any) => {
		if (!isOpen) event.stopPropagation();
		isOpen = true;
	};
	const closeMenu = () => {
		isOpen = false;
	};
</script>

<svelte:body on:click={closeMenu} />

<nav class="absolute bg-linear-b-w py-5 z-10 mx-auto w-full px-5">
	<div class="flex items-start justify-between items-center">
		<a href={ROUTES.HOME} class="flex items-center">
			<img src="/img/les-nicois.png" alt="Un dessin d'Ambre et Nicolas grimpant" class="w-14" />
			<span class="text-2xl text-white font-extralight ml-4"> Les Niçois en Vadrouille </span>
		</a>
		<BurgerIcon {isOpen} onClick={openMenu} ratio={3} />
	</div>
	<div class="flex flex-col items-end">
		{#if isOpen}
			<div transition:slide class="pt-3">
				{#each sports as sport}
					<a
						href={`/sport/${sport.slug}`}
						class="flex text-white block px-4 py-2 text-sm justify-start items-center uppercase"
						role="menuitem"
						tabindex="-1"
					>
						<p>{sport.name} ({getAdventureDataBySportSlug(sport.slug).length})</p>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</nav>

<style>
	.bg-linear-b-w {
		background: linear-gradient(rgba(0, 0, 0, 0.5) 95%, rgba(0, 0, 0, 0));
	}
</style>
