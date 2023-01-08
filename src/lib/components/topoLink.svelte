<script lang="ts">
	import { topoSources } from '$lib/constants';

	export let topo: string;

	const topoSource = topoSources.find((topoSource) => topo.includes(topoSource.webDomain));
</script>

<a href={topo} target="_blank" rel="noreferrer">
	{#if topoSource}
		{topoSource.name}
	{:else}
		Topo
	{/if}
</a>
