<script lang="ts">
	import { getPhotosFromShareLink } from '$lib/services/googlePhotoService';
	import type { Photo } from '$lib/types';
	import { onMount } from 'svelte';

	export let photoList: Photo[] = [];
	onMount(async () => {
		photoList = await getPhotosFromShareLink('https://photos.app.goo.gl/Hzg2RSMnfdtV2S5R8');
	});
</script>

<div class="flex flex-wrap flex-row gap-5">
	{#each photoList as photo}
		<div class="max-w-20">
			<img src={`${photo.baseLink}=w480-h270`} />
		</div>
	{/each}
</div>
