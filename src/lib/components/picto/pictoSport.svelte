<script lang="ts">
	import { Sports } from '$lib/constants';
	import HikeBoot from '../icons/sport/new/hikeBoot.svelte';
	import RockClimbing from '../icons/sport/new/rockClimbing.svelte';
	import SkiBoot from '../icons/sport/new/skiBoot.svelte';

	const DEFAULT_ICON = HikeBoot;

	const sportToPicto = {
		[Sports.HIKING]: HikeBoot,
		[Sports.ALPINISM]: RockClimbing,
		[Sports.SPELEO]: RockClimbing,
		[Sports.SKI_ALPIN]: SkiBoot,
		[Sports.ESCALADE_COUENNE]: RockClimbing,
		[Sports.ESCALADE_GRANDE_VOIE]: RockClimbing,
		[Sports.SKI_DE_RANDO]: SkiBoot
	};

	export let sport;
	export let fill;

	let picto = sportToPicto.hasOwnProperty(sport) ? sportToPicto[sport] : DEFAULT_ICON;
</script>

<svelte:component this={picto} {fill} />
