<script lang="ts">
	import { Sports } from '$lib/constants';
	import HikingIcon from './icons/hiking.svelte';
	import MountaineeringIcon from './icons/mountaineering.svelte';
	import ResortSkiingIcon from './icons/resortSkiing.svelte';
	import RockClimbingIcon from './icons/rockClimbing.svelte';
	import SkiTouringIcon from './icons/skiTouring.svelte';

	const sportToPicto = {
		[Sports.HIKING]: HikingIcon,
		[Sports.ALPINISM]: MountaineeringIcon,
		[Sports.SPELEO]: MountaineeringIcon,
		[Sports.SKI_ALPIN]: ResortSkiingIcon,
		[Sports.ESCALADE_COUENNE]: RockClimbingIcon,
		[Sports.ESCALADE_GRANDE_VOIE]: RockClimbingIcon,
		[Sports.SKI_DE_RANDO]: SkiTouringIcon
	};

	export let sport;

	let picto = sportToPicto[sport];
</script>

<div>
	<svelte:component this={picto} />
</div>
