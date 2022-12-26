<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Picture } from '$lib/types';

	const dispatch = createEventDispatcher();

	const togglePicture = (pictureId: string | number) => {
		dispatch('togglePicture', { pictureId });
	};

	export let selectedPictures: (string | number)[];
	export let pictures: Picture[] = [];
</script>

<div class="cursor-pointer w-full h-40 overflow-x-scroll overflow-y-hidden whitespace-nowrap">
	{#each pictures as picture}
		{#if !!picture.url}
			<button
				class="inline-block mr-2 h-full relative cursor-pointer"
				data-lg-size={`${picture.width}-${picture.height}`}
				data-src={picture.url}
				on:click={() => togglePicture(picture.id)}
			>
				{#if selectedPictures.includes(picture.id)}
					<div class="absolute h-full w-full opacity-30 bg-blue-500" />
					<span class="absolute bottom-1 left-2 material-icons text-lg text-white">
						check_circle
					</span>
				{/if}
				<img src={picture.formats.small.url} class="h-full object-contain" />
			</button>
		{/if}
	{/each}
</div>
