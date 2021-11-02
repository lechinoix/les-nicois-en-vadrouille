<script lang="ts">
	import { formatAssetUrl } from '$lib/services/adventureService';

	import type { Adventure } from '$lib/types';
	import PictoSport from './picto/pictoSport.svelte';
	import Calendar from './icons/calendar.svelte';
	import Picto from './picto/index.svelte';
	import StrongArm from './icons/strongArm.svelte';
	import Container from '$lib/components/Container.svelte';

	export let adventure: Adventure;

	const getCoverUrlFromAdventure = (adventure: Adventure) => {
		if (adventure.pictures.length === 0) return null;
		const firstPicture = adventure.pictures[0];

		return firstPicture.formats.xlarge ? firstPicture.formats.xlarge.url : firstPicture.url;
	};

	let iconFillColor = 'rgba(75, 85, 99)';
</script>

<div>
	<a href={`/adventures/${adventure.id}`} class="relative w-screen h-96 flex bg-gray-400">
		<div class="absolute w-full h-full flex justify-center">
			<strong
				class="
				block text-white font-bold text-5xl text-center
				py-3 px-2 self-center
				bg-gray-900 bg-opacity-10 bg-clip-border
				border-t-2 border-b-2 border-white
			"
			>
				{adventure.title}
			</strong>
		</div>
		{#if adventure.pictures && adventure.pictures.length > 0}
			<img
				class="w-screen max-w-full object-cover"
				src={getCoverUrlFromAdventure(adventure)}
				alt={adventure.pictures[0].alternativeText}
			/>
		{/if}
	</a>
	<Container>
		<div class="flex flex-col justify-center pb-7">
			<div class="flex justify-center pt-7">
				{#if adventure.date}
					<Picto label={adventure.date}>
						<Calendar fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure.sports && adventure.sports.length > 0}
					<Picto label={adventure.sports[0].name}>
						<PictoSport sport={adventure.sports[0].slug} fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure.cotation}
					<Picto label={adventure.cotation}>
						<StrongArm fill={iconFillColor} />
					</Picto>
				{/if}
			</div>
			<slot />
		</div>
	</Container>
</div>
