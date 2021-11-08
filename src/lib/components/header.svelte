<script lang="ts">
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/config/routes';
	import { getAllSports } from '$lib/services/sportService';
	import type { Link } from '$lib/types';
	import Dropdown from './ui/dropdown.svelte';

	let sportLinks: Link[] = null;

	onMount(async () => {
		const sports = await getAllSports();

		sportLinks = sports.map((sport) => ({ url: `/sport/${sport.slug}`, label: sport.name }));
	});
</script>

<nav
	class="fixed bg-white h-20 flex items-center z-10 mx-auto w-screen px-10 shadow-lg justify-between"
>
	<a href={ROUTES.HOME} class="block">
		<span class="text-2xl font-semibold whitespace-nowrap"> Our Little Adventures </span>
	</a>
	<Dropdown links={sportLinks} title="Sports" />
</nav>
