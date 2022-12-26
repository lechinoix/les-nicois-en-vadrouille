<script lang="ts">
	import Input from '$lib/components/form/input.svelte';
	import SelectableGallery from '$lib/components/gallery/selectableGallery.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { getPhotosFromShareLink } from '$lib/services/googlePhotoService';
	import type { Picture } from '$lib/types';
	import { onMount } from 'svelte';

	export let onClose: () => void;
	export let albumPictures: (string | number)[];
	let selectedPictures = albumPictures;
	let pictures: Picture[] = [];
	let albumLink: string;

	const getAlbumPictures = async () => {
		if (!albumLink) return;
		pictures = await getPhotosFromShareLink(albumLink);
	};

	const togglePictureHandler = ({ detail: { pictureId } }: any) => {
		if (selectedPictures.includes(pictureId)) {
			selectedPictures = selectedPictures.filter(
				(selectedPicture) => selectedPicture !== pictureId
			);
		} else {
			selectedPictures = [...selectedPictures, pictureId];
		}
	};

	onMount(async () => {});
</script>

<Modal on:close={onClose}>
	<Input
		name="album"
		label="Album"
		placeholder="https://photos.app.goo.gl/Hzg2RSMnfdtV2S5R8"
		bind:value={albumLink}
	/>
	<button on:click={getAlbumPictures}>Get Pictures</button>
	<SelectableGallery {pictures} {selectedPictures} on:togglePicture={togglePictureHandler} />
</Modal>
