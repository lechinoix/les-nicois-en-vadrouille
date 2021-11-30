<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { CoverTypes, iconFillColor } from '$lib/constants';

	import AdventureCover from './coverPicture/adventureCover.svelte';
	import PictoSport from './picto/pictoSport.svelte';
	import Calendar from './icons/calendar.svelte';
	import Picto from './picto/index.svelte';
	import StrongArm from './icons/strongArm.svelte';
	import Container from '$lib/components/container.svelte';

	export let adventure: Adventure;
</script>

<div>
	<AdventureCover {adventure} coverType={CoverTypes.LARGE} />
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
