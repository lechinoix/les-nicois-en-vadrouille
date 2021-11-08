<script lang="ts">
	import { formatAssetUrl } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';

	import AdventureCover from './adventureCover/largeCover.svelte';
	import PictoSport from './picto/pictoSport.svelte';
	import Calendar from './icons/calendar.svelte';
	import Picto from './picto/index.svelte';
	import StrongArm from './icons/strongArm.svelte';
	import Container from '$lib/components/container.svelte';

	export let adventure: Adventure;

	let iconFillColor = 'rgba(75, 85, 99)';
</script>

<div>
	<a href={`/adventures/${adventure.id}`} class="relative w-screen h-96 flex bg-gray-400">
		<AdventureCover {adventure} />
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
