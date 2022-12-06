<script lang="ts">
	import type { Adventure } from '$lib/types';
	import { CoverTypes, iconFillColor, Sports } from '$lib/constants';

	import AdventureCover from '$lib/components/adventures/adventureCover.svelte';
	import PictoSport from '../picto/pictoSport.svelte';
	import Picto from '../picto/index.svelte';
	import StrongArm from '../icons/various/new/strength.svelte';
	import Container from '$lib/components/container.svelte';
	import Mountain from '../icons/various/new/mountain.svelte';
	import Compass from '../icons/various/new/compass.svelte';

	export let adventure: Adventure;
	export let onClick: (() => void) | null = null;
</script>

<div>
	<AdventureCover {adventure} {onClick} coverType={CoverTypes.LARGE} />
	<Container>
		<div class="flex flex-col justify-center py-7">
			<div class="flex flex-wrap gap-y-7 justify-center">
				{#if adventure?.places && adventure?.places?.length > 0}
					<Picto label={adventure.places[0].name ?? undefined}>
						<Mountain fill={iconFillColor} />
					</Picto>
				{/if}
				{#if adventure?.sports && adventure?.sports?.length > 0}
					<Picto label={adventure.sports[0]}>
						<PictoSport
							sportSlug={/* @ts-ignore */ Sports[adventure.sports[0]]}
							fill={iconFillColor}
						/>
					</Picto>
				{/if}
				{#if adventure?.cotation}
					<Picto label={adventure.cotation}>
						<StrongArm fill={iconFillColor} />
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
