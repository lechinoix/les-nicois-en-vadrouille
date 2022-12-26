<script lang="ts">
	import { getPhotosFromShareLink } from '$lib/services/googlePhotoService';
	import type { Picture } from '$lib/types';
	import { onMount } from 'svelte';
	import Slider from '../slider.svelte';

	export let pictures: Picture[] = [];
	onMount(async () => {
		pictures = await getPhotosFromShareLink('https://photos.app.goo.gl/Hzg2RSMnfdtV2S5R8');
	});
</script>

<Slider {pictures} />
