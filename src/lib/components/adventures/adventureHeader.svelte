<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { CoverTypes, iconFillColor } from '$lib/constants';

	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import PictoSport from '../picto/pictoSport.svelte';
	import Picto from '../picto/index.svelte';
	import StrongArm from '../icons/various/new/strength.svelte';
	import Container from '$lib/components/container.svelte';
	import Mountain from '../icons/various/new/mountain.svelte';
	import SandClock from '../icons/various/new/sandClock.svelte';
	import Compass from '../icons/various/new/compass.svelte';

	export let adventure: Adventure;
	export let onClick: (() => void) | null = null;
</script>

<div>
	<AdventureCover {adventure} {onClick} coverType={CoverTypes.LARGE} />
	<Container>
		<div class="flex flex-col justify-center py-7">
			<div class="flex flex-wrap gap-y-7 justify-center">
				{#if adventure?.places?.length > 0}
					<Picto label={adventure.places[0].name}>
						<Mountain fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure?.sports?.length > 0}
					<Picto label={adventure.sports[0].name}>
						<PictoSport sportSlug={adventure.sports[0].slug} fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure?.cotation}
					<Picto label={adventure.cotation}>
						<StrongArm fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure?.number_of_days}
					<Picto label={`${adventure.number_of_days} jour(s)`}>
						<SandClock fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure?.orientation}
					<Picto label={adventure.orientation}>
						<Compass fill={iconFillColor} />
					</Picto>
				{/if}
			</div>
			<slot />
		</div>
	</Container>
</div>
