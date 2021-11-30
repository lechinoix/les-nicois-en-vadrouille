<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getAdventureById, getLatestAdventures } from '$lib/services/adventureService';
	import Loader from '$lib/components/loader.svelte';
	import HomeCover from '$lib/components/adventureCover/homeCover.svelte';
	import SmallCover from '$lib/components/adventureCover/smallCover.svelte';
	import { ROUTES } from '$lib/config/routes';

	const COVER_ADVENTURE_ID = '17';

	let pageVisible = false;
	let latestAdventuresPromise = getLatestAdventures();
	let coverAdventurePromise = Promise.all([
		getAdventureById(COVER_ADVENTURE_ID),
		new Promise((resolve) => setTimeout(resolve, 1000))
	]).then(([adventure]) => adventure);
</script>

{#await coverAdventurePromise}
	<div
		transition:fade={{ duration: 400 }}
		on:introstart={() => (pageVisible = false)}
		on:outroend={() => (pageVisible = true)}
		class="w-screen h-screen flex justify-center items-center"
	>
		<Loader />
	</div>
{:then coverAdventure}
	{#if pageVisible}
		<div in:fade={{ duration: 500 }}>
			<HomeCover adventure={coverAdventure} />
			<div class="p-10 flex flex-col w-full justify-center items-center">
				<div class="flex justify-center flex-col md:flex-row mx-5">
					<div class="flex flex-col mb-10 md:mb-0 md:mr-10">
						<strong class="font-title font-light text-3xl">Hello 👋</strong>
						<br />
						<p class=" text-xl text-justify">
							Nous sommes un couple de jeunes aventuriers à la recherche de sensations fortes en
							montagne ! Basés sur Grenoble, nous pratiquons l'alpinisme, l'escalade et le ski.
						</p>
					</div>
					<img
						src="https://res.cloudinary.com/dowsxscl0/image/upload/v1637106159/IMG_0062_ee3ed1b552.jpg"
						class="w-full md:w-96"
						alt="Nous deux en haut du mont Coolidge, la Barre des Écrins est juste derrière !"
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
					<a class="pt-5 text-xl text-gray-600 self-end" href={ROUTES.ADVENTURES.DONE}
						>En voir plus</a
					>
				{:catch error}
					{error}
				{/await}
			</div>
		</div>
	{/if}
{/await}
