<script lang="ts">
	import { formatAssetUrl } from '$lib/services/adventureService';
	import type { Adventure } from '$lib/types';
	import TopoLink from './topoLink.svelte';

	export let adventure: Adventure;
</script>

<a
	href={`/adventures/${adventure.id}`}
	class="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white hover:bg-gray-100 border shadow-md items-center"
>
	<div class="p-4 flex flex-col justify-between leading-normal">
		<h5 class="text-gray-900 font-bold text-2xl tracking-tight mb-2">
			{adventure.title}
		</h5>
		<p class="font-normal text-gray-700 mb-3">{adventure.short_description}</p>
		{#if adventure.topo.length > 0}
			<TopoLink topo={adventure.topo[0]} />
		{/if}
	</div>
</a>
