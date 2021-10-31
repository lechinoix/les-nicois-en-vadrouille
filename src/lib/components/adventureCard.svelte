<script lang="ts">
	import type { Adventure } from '$lib/types';
	import PictoSport from './pictoSport/index.svelte';

	export let adventure: Adventure;
</script>

<div>
	<a href={`/adventures/${adventure.id}`} class="relative w-screen h-96 flex bg-gray-400">
		<div class="absolute w-full h-full flex justify-center">
			<strong class="block text-white font-bold text-5xl mr-2 mb-2 self-center">
				{adventure.title}
			</strong>
		</div>
		<img
			class="w-screen max-w-full object-cover"
			src={adventure.pictures[0].url}
			alt={adventure.pictures[0].alternativeText}
		/>
	</a>
	<div class="flex flex-col justify-center px-5	pb-7">
		{#if adventure.sports.length > 0}
			<div class="flex justify-center pt-7">
				<div class="flex flex-col items-center">
					<PictoSport sport={adventure.sports[0].slug} />
					<p class="pt-2 text-sm">{adventure.sports[0].name}</p>
				</div>
			</div>
		{/if}
		<slot />
	</div>
</div>
