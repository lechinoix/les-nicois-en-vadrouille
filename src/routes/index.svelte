<script context="module" lang="ts">
	import { getLatestAdventures } from '$lib/services/adventureService';
	import { getAllSports } from '$lib/services/sportService';
	import { fetchPictureById } from '$lib/services/uploadPluginService';
	import type { LoadInput } from '@sveltejs/kit';

	export const prerender = true;
	export async function load({ fetch }: LoadInput) {
		let latestAdventures = await getLatestAdventures();
		let coverPicture = await fetchPictureById(fetch, env.COVER_PICTURE_ID);
		let sports = await getAllSports(fetch);

		return {
			props: { latestAdventures, coverPicture, sports }
		};
	}
</script>

<script lang="ts">
	import type { Adventure, Picture, Sport } from '$lib/types';
	import {
		CoverTypes,
		DEFAULT_DESCRIPTION,
		DEFAULT_TITLE,
		HOMEPAGE_US_IMAGE_URL,
		PicturePosition
	} from '$lib/constants';
	import AdventureCover from '$lib/components/adventures/coverPicture/adventureCover.svelte';
	import { ROUTES } from '$lib/config/routes';
	import SeparatorTitle from '$lib/components/ui/separatorTitle.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';
	import SmallCover from '$lib/components/adventures/coverPicture/coverTypes/smallCover.svelte';
	import HomeCover from '$lib/components/coverPicture/homeCover.svelte';
	import env from '$lib/config/index';

	export let latestAdventures: Adventure[];
	export let coverPicture: Picture;
	export let sports: Sport[];

	$: adventureItems = latestAdventures.map((adventure) => ({
		component: AdventureCover,
		props: { adventure, coverType: CoverTypes.SMALL },
		key: `${adventure.id}`
	}));

	$: sportItems = sports.map((sport) => ({
		component: SmallCover,
		props: {
			picture: sport.cover_picture.picture,
			position: sport.cover_picture.position,
			title: sport.name,
			href: `/sport/${sport.slug}`
		},
		key: `${sport.id}`
	}));
</script>

<svelte:head>
	<meta property="og:image" content={coverPicture.formats.medium.url} />
	<meta property="og:title" content={DEFAULT_TITLE} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
</svelte:head>

<HomeCover picture={coverPicture} position={PicturePosition.TOP_LEFT} />
<div class="p-10 flex flex-col w-full justify-center items-center">
	<div class="flex justify-center flex-col md:flex-row mx-5">
		<div class="flex flex-col mb-10 md:mb-0 md:mr-10">
			<strong class="font-light text-3xl">HELLO</strong>
			<br />
			<p class="text-xl text-justify font-sans font-thin">
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
	<div class="w-full">
		<ResponsiveGrid items={adventureItems} />
	</div>
	<a class="pt-5 text-xl text-gray-800 self-end" href={ROUTES.ADVENTURES.DONE}>En voir plus</a>
	<SeparatorTitle title="Nos sports" />
	<div class="w-full">
		<ResponsiveGrid items={sportItems} />
	</div>
</div>
