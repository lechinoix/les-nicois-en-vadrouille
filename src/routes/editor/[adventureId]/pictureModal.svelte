<script lang="ts">
	import Input from '$lib/components/form/input.svelte';
	import SelectableGallery from '$lib/components/gallery/selectableGallery.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { getAllAlbums, getPhotosFromShareLink } from '$lib/services/googlePhotoService';
	import type { Picture } from '$lib/types';
	import uniqBy from 'lodash/uniqBy';

	export let closeModal: () => void;
	export let adventurePictures: Picture[] | null;
	let allAlbums = getAllAlbums();
	let selectedPictures = adventurePictures?.map((picture) => picture.id) ?? [];
	let albumPictures: Picture[] = [];
	let newAlbumLink: string;

	const getAlbumPictures = async (albumLink: string) => {
		if (!albumLink) return;
		albumPictures = await getPhotosFromShareLink(albumLink);
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

	const validatePictures = () => {
		adventurePictures = uniqBy(
			[
				...(adventurePictures?.filter((picture) => selectedPictures.includes(picture.id)) ?? []),
				...albumPictures.filter((picture) => selectedPictures.includes(picture.id))
			],
			(picture) => picture.id
		);
		closeModal();
	};
</script>

<Modal on:close={closeModal}>
	<SelectableGallery
		pictures={adventurePictures ?? []}
		{selectedPictures}
		on:togglePicture={togglePictureHandler}
	/>
	{#each allAlbums as album}
		<button
			on:click={() => getAlbumPictures(album.shareLink)}
			class="border-t border-gray-500 first:border-t-0">{album.title}</button
		>
	{/each}
	<Input
		name="album"
		label="Add an album"
		placeholder="https://photos.app.goo.gl/Hzg2RSMnfdtV2S5R8"
		bind:value={newAlbumLink}
	/>
	<button on:click={() => getAlbumPictures(newAlbumLink)}>Get Pictures</button>
	<SelectableGallery
		pictures={albumPictures}
		{selectedPictures}
		on:clickPicture={togglePictureHandler}
	/>
	<button on:click={validatePictures}>Submit</button>
</Modal>
