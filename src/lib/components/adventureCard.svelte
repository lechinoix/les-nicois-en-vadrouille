<script lang="ts">
	import type { Adventure } from '$lib/types';
	import PictoSport from './picto/pictoSport.svelte';
	import Calendar from './icons/calendar.svelte';
	import Picto from './picto/index.svelte';

	export let adventure: Adventure;
</script>

<div>
	<a href={`/adventures/${adventure.id}`} class="relative w-screen h-96 flex bg-gray-400">
		<div class="absolute w-full h-full flex justify-center">
			<strong
				class="
				block text-white font-bold text-5xl
				py-3 self-center
				bg-gray-900 bg-opacity-10 bg-clip-border
				border-t-2 border-b-2 border-white
			"
			>
				{adventure.title}
			</strong>
		</div>
		<img
			class="w-screen max-w-full object-cover"
			src={adventure.pictures[0].url}
			alt={adventure.pictures[0].alternativeText}
		/>
	</a>
	<div class="flex flex-col justify-center px-5 pb-7">
		<div class="flex justify-center pt-7">
			{#if adventure.date}
				<Picto label={adventure.date}>
					<Calendar />
				</Picto>
			{/if}
			{#if adventure.sports && adventure.sports.length > 0}
				<Picto label={adventure.sports[0].name}>
					<PictoSport sport={adventure.sports[0].slug} />
				</Picto>
			{/if}
		</div>
		<slot />
	</div>
</div>
