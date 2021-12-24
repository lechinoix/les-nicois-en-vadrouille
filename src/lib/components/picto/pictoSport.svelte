<script lang="ts">
	import { Sports } from '$lib/constants';
	import HikingIcon from '../icons/sport/old/hiking.svelte';
	import MountaineeringIcon from '../icons/sport/old/mountaineering.svelte';
	import ResortSkiingIcon from '../icons/sport/old/resortSkiing.svelte';
	import RockClimbingIcon from '../icons/sport/old/rockClimbing.svelte';
	import SkiTouringIcon from '../icons/sport/old/skiTouring.svelte';

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
	export let fill;

	let picto = sportToPicto[sport];
</script>

<svelte:component this={picto} {fill} />
