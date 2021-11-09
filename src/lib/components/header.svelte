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
		<span class="text-2xl font-semibold whitespace-nowrap"> Our Little Adventures </span>
	</a>
	<Dropdown title="Sports">
		{#each sports as sport}
			<a
				href={`/sport/${sport.slug}`}
				class="text-gray-700 block px-4 py-2 text-sm"
				role="menuitem"
				tabindex="-1"
			>
				<PictoSport sport={sport.slug} fill={iconFillColor} />
				<p>{sport.name}</p>
			</a>
		{/each}
	</Dropdown>
</nav>
