<script lang="ts">
	import { CoverTypes, HOMEPAGE_US_IMAGE_URL } from '$lib/constants';
	import Suspense from '$lib/components/suspense.svelte';
	import { getAdventureById, getLatestAdventures } from '$lib/services/adventureService';
	import { getAllSports } from '$lib/services/sportService';
	import AdventureCover from '$lib/components/coverPicture/adventureCover.svelte';
	import { ROUTES } from '$lib/config/routes';
	import LargeCover from '$lib/components/coverPicture/coverTypes/largeCover.svelte';

	const COVER_ADVENTURE_ID = '17';

	let latestAdventuresPromise = getLatestAdventures();
	let coverAdventurePromise = getAdventureById(COVER_ADVENTURE_ID);
	let sportsPromise = getAllSports();
</script>

<Suspense contentPromise={coverAdventurePromise}>
	<div slot="content" let:content={coverAdventure}>
		<AdventureCover adventure={coverAdventure} coverType={CoverTypes.HOME} />
		<div class="p-10 flex flex-col w-full justify-center items-center">
			<div class="flex justify-center flex-col md:flex-row mx-5">
				<div class="flex flex-col mb-10 md:mb-0 md:mr-10">
					<strong class="font-title font-light text-3xl">HELLO</strong>
					<br />
					<p class="text-xl text-justify font-light">
						Nous sommes un couple de jeunes aventuriers à la recherche de sensations fortes en
						montagne ! Basés sur Grenoble, on pratique l'alpinisme, l'escalade et le ski.
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
			<Suspense contentPromise={latestAdventuresPromise}>
				<div slot="content" let:content={latestAdventures}>
					<p class="font-title text-2xl mt-10">Nos dernières sorties</p>
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
					<a class="pt-5 text-xl text-gray-600 self-end" href={ROUTES.ADVENTURES.DONE}
						>En voir plus</a
					>
				</div>
			</Suspense>
			<Suspense contentPromise={sportsPromise}>
				<div slot="content" let:content={sports}>
					<p class="font-title text-2xl mt-10">Nos sports</p>
					{#each sports as sport}
						{#if sport.cover_picture}
							<LargeCover
								picture={sport.cover_picture.picture}
								position={sport.cover_picture.position}
								title={sport.name}
								href={`/sport/${sport.slug}`}
							/>
						{/if}
					{/each}
				</div>
			</Suspense>
		</div>
	</div>
</Suspense>
