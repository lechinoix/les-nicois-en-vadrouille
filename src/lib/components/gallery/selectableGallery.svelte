<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Picture } from '$lib/types';

	const dispatch = createEventDispatcher();

	let copiedPictureId: string | number = '';

	const clickPicture = (pictureId: string | number) => {
		dispatch('clickPicture', { pictureId });
	};

	const unselectPicture = (pictureId: string | number) => {
		dispatch('unselectPicture', { pictureId });
	};

	const copyImageUrl = async (picture: Picture) => {
		const isLandscape = picture.width > picture.height;
		await navigator.clipboard.writeText(isLandscape ? picture.formats.xlarge.url : picture.url);
		copiedPictureId = picture.id;
	};

	export let selectedPictures: (string | number)[];
	export let pictures: Picture[] = [];
	export let shouldShowDelete = false;

	$: {
		console.log(`Copied picture: ${copiedPictureId}`);
		window.setTimeout(() => {
			copiedPictureId = '';
		}, 2000);
	}
</script>

<div class="cursor-pointer w-full h-40 overflow-x-scroll overflow-y-hidden whitespace-nowrap">
	{#each pictures as picture}
		{#if !!picture.url}
			<button
				class="inline-block mr-2 h-full relative cursor-pointer"
				data-lg-size={`${picture.width}-${picture.height}`}
				data-src={picture.url}
				on:click={() => clickPicture(picture.id)}
			>
				{#if selectedPictures.includes(picture.id)}
					<div class="absolute h-full w-full opacity-30 bg-blue-500" />
				{/if}
				<div class="absolute flex bottom-1 w-full justify-between">
					{#if selectedPictures.includes(picture.id)}
						<span class="ml-2 material-icons text-lg text-white"> check_circle </span>
					{:else}
						<span />
					{/if}
					<div class="flex ">
						<button
							class="mr-2 mb-1 material-icons text-sm text-gray-600 px-1 py-1 bg-white rounded-sm"
							on:click|stopPropagation={() => copyImageUrl(picture)}
						>
							{copiedPictureId === picture.id ? 'check' : 'content_copy'}
						</button>
						{#if shouldShowDelete}
							<button
								class="mr-2 mb-1 material-icons text-sm text-gray-600 px-1 py-1 bg-white rounded-sm"
								on:click|stopPropagation={() => unselectPicture(picture.id)}
							>
								close
							</button>
						{/if}
					</div>
				</div>
				<img src={picture.formats.small.url} class="h-full object-contain" />
			</button>
		{/if}
	{/each}
</div>
