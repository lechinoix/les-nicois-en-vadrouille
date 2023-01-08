<script lang="ts">
	import { findTopoSourceFromLink } from '$lib/services/topoService';

	export let topo: string;

	const topoSource = findTopoSourceFromLink(topo);
</script>

<a href={topo} target="_blank" rel="noreferrer">
	{#if topoSource}
		{topoSource.name}
	{:else}
		Topo
	{/if}
</a>
