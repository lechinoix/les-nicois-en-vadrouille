<script lang="ts">
	import { getAdventureById, getLatestAdventures } from '$lib/services/adventureService';
	import Loader from '$lib/components/loader.svelte';
	import HomeCover from '$lib/components/adventureCover/homeCover.svelte';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';

	const COVER_ADVENTURE_ID = '17';

	let latestAdventuresPromise = getLatestAdventures();
	let coverAdventurePromise = getAdventureById(COVER_ADVENTURE_ID);
</script>

{#await coverAdventurePromise}
	<Loader />
{:then coverAdventure}
	<HomeCover adventure={coverAdventure} />
	<div class="p-10 flex flex-col w-full justify-center items-center">
		<div class="flex justify-center">
			<div class="flex flex-col">
				<strong class="font-title font-light text-3xl">Hello 👋</strong>
				<br />
				<p class=" text-xl w-96 text-justify mr-10">
					Nous sommes un couple de jeunes aventuriers à la recherche de sensations fortes en
					montagne ! Basés sur Grenoble, on pratique l'alpinisme, l'escalade et le ski.
				</p>
			</div>
			<img
				src="https://res.cloudinary.com/dowsxscl0/image/upload/v1637106159/IMG_0062_ee3ed1b552.jpg"
				class="w-96"
			/>
		</div>
		{#await latestAdventuresPromise}
			<Loader />
		{:then latestAdventures}
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
						<SmallCover {adventure} />
					</div>
				{/each}
			</div>
		{:catch error}
			{error}
		{/await}
	</div>
{/await}
