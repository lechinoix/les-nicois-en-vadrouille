<script lang="ts">
	import { TopoSource } from '$lib/constants';
	import type { Topo } from '$lib/types';

	export let topo: Topo;
</script>

<a href={topo.url} target="_blank">
	{#if topo.source === TopoSource.C2C}
		CamptoCamp
	{:else if topo.source === TopoSource.Skitour}
		Skitour
	{:else}
		Topo
	{/if}
</a>
