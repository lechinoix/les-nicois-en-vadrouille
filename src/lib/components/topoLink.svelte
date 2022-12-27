<script lang="ts">
	import { TopoSource } from '$lib/constants';

	export let topo: string;
</script>

<a href={topo} target="_blank">
	{#if topo.includes(TopoSource.C2C)}
		CamptoCamp
	{:else if topo.includes(TopoSource.SKITOUR)}
		Skitour
	{:else}
		Topo
	{/if}
</a>
