<script context="module">
	import { getAdventureById, getLatestAdventures } from '$lib/services/adventureService';
	import { getAllSports } from '$lib/services/sportService';

	export const prerender = true;
	export async function load() {
		const COVER_ADVENTURE_ID = '17';

		let latestAdventures = await getLatestAdventures();
		let coverAdventure = await getAdventureById(COVER_ADVENTURE_ID);
		let sports = await getAllSports();

		return {
			props: { latestAdventures, coverAdventure, sports },
			maxage: 86400
		};
	}
</script>

<script lang="ts">
	import type { Adventure, Sport } from '$lib/types';
	import { CoverTypes, HOMEPAGE_US_IMAGE_URL } from '$lib/constants';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { ROUTES } from '$lib/config/routes';
	import LargeCover from '$lib/components/coverPicture/coverTypes/largeCover.svelte';
	import SeparatorTitle from '$lib/components/ui/separatorTitle.svelte';

	export let latestAdventures: Adventure[];
	export let coverAdventure: Adventure;
	export let sports: Sport[];
</script>

<AdventureCover adventure={coverAdventure} coverType={CoverTypes.HOME} />
<div class="p-10 flex flex-col w-full justify-center items-center">
	<div class="flex justify-center flex-col md:flex-row mx-5">
		<div class="flex flex-col mb-10 md:mb-0 md:mr-10">
			<strong class="font-title font-light text-3xl">HELLO</strong>
			<br />
			<p class="text-xl text-justify font-light">
				Nous sommes un couple de jeunes aventuriers à la recherche de sensations fortes en montagne
				! Basés sur Grenoble, on pratique l'alpinisme, l'escalade et le ski.
				<br />
				Notre objectif : raconter nos aventures, donner envie de s’installer dans cette belle région
				et de se lancer dans l’aventure outdoor quel quelle soit ..
			</p>
		</div>
		<img
			src={HOMEPAGE_US_IMAGE_URL}
			class="w-full md:w-96"
			alt="Nous deux en haut du mont Coolidge, la Barre des Écrins est juste derrière !"
		/>
	</div>
	<SeparatorTitle title="Nos dernières sorties" />
	<div
		class="
			inline-grid w-full
			xl:grid-cols-3 md:grid-cols-2 grid-cols-1
			grid-flow-row gap-5
			mt-12"
	>
		{#each latestAdventures as adventure}
			<div class="flex w-full justify-center">
				<AdventureCover {adventure} coverType={CoverTypes.SMALL} />
			</div>
		{/each}
	</div>
	<a class="pt-5 text-xl text-gray-600 self-end" href={ROUTES.ADVENTURES.DONE}>En voir plus</a>
	<SeparatorTitle title="Nos sports" />
	{#each sports as sport}
		{#if sport.cover_picture}
			<div class="mt-10">
				<LargeCover
					picture={sport.cover_picture.picture}
					position={sport.cover_picture.position}
					title={sport.name}
					href={`/sport/${sport.slug}`}
				/>
			</div>
		{/if}
	{/each}
</div>
