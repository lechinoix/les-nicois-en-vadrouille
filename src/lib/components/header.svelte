<script lang="ts">
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/config/routes';
	import { getAllSports } from '$lib/services/sportService';
	import Dropdown from './ui/dropdown.svelte';
	import type { Sport } from '$lib/types';
	import PictoSport from './picto/pictoSport.svelte';
	import { iconFillColor } from '$lib/constants';

	let sports: Sport[] = null;

	onMount(async () => {
		sports = await getAllSports();
	});
</script>

<nav
	class="fixed bg-white h-20 flex items-center z-10 mx-auto w-screen px-10 shadow-lg justify-between"
>
	<a href={ROUTES.HOME} class="block">
		<span class="text-2xl font-extralight font-title whitespace-nowrap">
			Our Little Adventures
		</span>
	</a>
	<Dropdown title="Sports">
		{#if !!sports}
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
		{/if}
	</Dropdown>
</nav>
