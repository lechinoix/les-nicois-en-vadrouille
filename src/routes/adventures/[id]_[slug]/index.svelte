<script context="module" lang="ts">
	import { getAdventureById } from '$lib/services/adventureService';
	import type { LoadInput } from '@sveltejs/kit';

	export const prerender = true;
	export async function load({ page }: LoadInput) {
		const adventure = await getAdventureById(page.params.id);
		return {
			props: { adventure }
		};
	}
</script>

<script lang="ts">
	import type { Adventure } from '$lib/types';
	import AdventurePage from './_components/adventurePage.svelte';
	export let adventure: Adventure;
</script>

<AdventurePage {adventure} />
