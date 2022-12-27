<script lang="ts">
	import Input from '$lib/components/form/input.svelte';
	import SelectableGallery from '$lib/components/gallery/selectableGallery.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { getPhotosFromShareLink } from '$lib/services/googlePhotoService';
	import type { Picture } from '$lib/types';
	import uniqBy from 'lodash/uniqBy';

	export let closeModal: () => void;
	export let adventurePictures: Picture[] | null;
	let selectedPictures = adventurePictures?.map((picture) => picture.id) ?? [];
	let albumPictures: Picture[] = [];
	let albumLink: string;

	const getAlbumPictures = async () => {
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
	<Input
		name="album"
		label="Album"
		placeholder="https://photos.app.goo.gl/Hzg2RSMnfdtV2S5R8"
		bind:value={albumLink}
	/>
	<button on:click={getAlbumPictures}>Get Pictures</button>
	<SelectableGallery
		pictures={albumPictures}
		{selectedPictures}
		on:clickPicture={togglePictureHandler}
	/>
	<button on:click={validatePictures}>Submit</button>
</Modal>
