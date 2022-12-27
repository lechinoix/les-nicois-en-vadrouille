<script lang="ts">
	import type { Adventure, Picture, Sport } from '$lib/types';
	import {
		CoverTypes,
		DEFAULT_DESCRIPTION,
		DEFAULT_TITLE,
		HOMEPAGE_US_IMAGE_URL,
		PicturePosition
	} from '$lib/constants';
	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import { ROUTES } from '$lib/config/routes';
	import SeparatorTitle from '$lib/components/ui/separatorTitle.svelte';
	import ResponsiveGrid from '$lib/components/ui/responsiveGrid.svelte';
	import SmallCover from '$lib/components/coverPicture/smallCover.svelte';
	import HomeCover from '$lib/components/coverPicture/homeCover.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;

	$: adventureItems = data.latestAdventures.map((adventure) => ({
		component: AdventureCover,
		props: { adventure, coverType: CoverTypes.SMALL },
		key: `${adventure.id}`
	}));

	$: sportItems = data.sports.map((sport) => ({
		component: SmallCover,
		props: {
			picture: sport.cover,
			position: sport.cover?.position,
			title: sport.name,
			href: `/sport/${sport.slug}`
		},
		key: `${sport.slug}`
	}));
</script>

<svelte:head>
	<meta property="og:image" content={data.coverPicture.formats.medium.url} />
	<meta property="og:title" content={DEFAULT_TITLE} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
</svelte:head>

<HomeCover picture={data.coverPicture} position={PicturePosition.TOP_LEFT} />
<div class="p-10 flex flex-col w-full justify-center items-center">
	<div class="flex justify-center flex-col md:flex-row mx-5">
		<div class="flex flex-col mb-10 md:mb-0 md:mr-10">
			<strong class="font-light text-3xl">HELLO</strong>
			<br />
			<p class="text-xl text-justify font-sans font-thin">
				Bienvenue sur notre blog qui recense toutes nos sorties Outdoor : ski, escalade, rando,
				alpi, cascade de glace ou encore spéléo. Nous sommes installés actuellement sur Grenoble
				donc beaucoup de nos aventures sont dans cette magnifique région : Belledonne, les Ecrins,
				le Vercors ...
				<br />
				Notre objectif : raconter nos aventures pour se souvenir dans 50 ans, mais aussi donner envie
				de s’installer dans cette belle région et de se lancer dans l’aventure outdoor quelle qu'elle
				soit .. et bientôt vous aider à planifier ou trouver la course qui correpsond le mieux à vos
				envies du moment !
				<br /><br />
				A bientôt dans les montagnes
				<br />
				Ambre & Nico
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
