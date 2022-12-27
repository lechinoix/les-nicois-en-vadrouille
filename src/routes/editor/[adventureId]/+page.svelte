<script lang="ts">
	import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { history } from '@milkdown/plugin-history';
	import { clipboard } from '@milkdown/plugin-clipboard';
	import { indent } from '@milkdown/plugin-indent';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { upload } from '@milkdown/plugin-upload';
	import { menu } from '@milkdown/plugin-menu';
	import { slash } from '@milkdown/plugin-slash';
	import { nord } from '@milkdown/theme-nord';
	import type { Adventure, CoverPicture } from '$lib/types';
	import Container from '$lib/components/container.svelte';
	import {
		clearDraft,
		getDraft,
		publishContent,
		saveDraft
	} from '$lib/services/contentCreationService';
	import { onMount } from 'svelte';
	import isEqual from 'lodash/isEqual';
	import Input from '$lib/components/form/input.svelte';
	import Select from '$lib/components/form/select.svelte';
	import { CardinalPoints, PicturePosition } from '$lib/constants';
	import type { PageData } from './$types';
	import PictureModal from './pictureModal.svelte';
	import SelectableGallery from '$lib/components/gallery/selectableGallery.svelte';

	export let data: PageData;
	export let ready: boolean = false;

	let currentVersion: Adventure;
	let showModal = false;
	let topAnchor: HTMLElement;

	let orientationOptions = Object.values(CardinalPoints).map((cardinalPoint) => ({
		label: cardinalPoint,
		value: cardinalPoint
	}));

	const picturePositionOptions = Object.values(PicturePosition).map((picturePosition) => ({
		label: picturePosition,
		value: picturePosition
	}));

	export let submitContent = async () => {
		const ongoingDraft = getDraft(currentVersion.id);
		if (!ongoingDraft) throw new Error('Failed to read ongoing draft');
		if (isEqual(ongoingDraft, data.adventure)) {
			console.log('No changes to publish');
			return;
		}

		await publishContent(ongoingDraft);
		clearDraft(currentVersion.id);
	};

	const resetDraft = () => {
		clearDraft(currentVersion.id);
		saveDraft(data.adventure);
		currentVersion = data.adventure;
		topAnchor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	};

	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	const changeCover = ({ detail: { pictureId } }: any) => {
		// @ts-ignore
		const cover: CoverPicture = {
			...currentVersion.pictures?.find((picture) => picture.id === pictureId),
			position: currentVersion.cover.position
		};
		currentVersion = {
			...currentVersion,
			cover
		};
	};

	onMount(async () => {
		const ongoingDraft = getDraft(data.adventure.id);
		if (ongoingDraft) {
			currentVersion = ongoingDraft;
		} else {
			resetDraft();
		}
		ready = true;

		return () => {
			ready = false;
		};
	});

	function editor(dom: HTMLElement) {
		Editor.make()
			.config((ctx: any) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, currentVersion.content);
				ctx.get(listenerCtx).markdownUpdated((_: any, markdown: string) => {
					currentVersion.content = markdown;
				});
			})
			.use(nord)
			.use(commonmark)
			.use(menu)
			.use(slash)
			.use(history)
			.use(clipboard)
			.use(indent)
			.use(listener)
			.use(upload)
			.create();
	}

	$: if (ready) saveDraft(currentVersion);
</script>

<div bind:this={topAnchor} />
<Container paddingHeader={true}>
	{#if ready}
		<Input name="title" label="Titre" bind:value={currentVersion.title} />
		<div class="flex flex-row gap-5">
			<Input name="cotation" label="Cotation" bind:value={currentVersion.cotation} />
			<Input
				name="elevation"
				label="Elevation"
				bind:value={currentVersion.elevation}
				type="number"
			/>
			<Select
				name="orientation"
				label="Orientation"
				options={orientationOptions}
				bind:value={currentVersion.orientation}
			/>
			<Input type="date" name="date" label="Date" bind:value={currentVersion.date} />
		</div>
		<Select
			name="cover-position"
			label="Cover Position"
			options={picturePositionOptions}
			bind:value={currentVersion.cover.position}
		/>
		<button on:click={openModal}>Modify pictures</button>
		<SelectableGallery
			pictures={currentVersion.pictures ?? []}
			selectedPictures={[currentVersion.cover?.id ?? '']}
			on:clickPicture={changeCover}
		/>
		<div use:editor />
		<button on:click={submitContent}>Publish</button>
		<button on:click={resetDraft}>Reset</button>
	{/if}
</Container>

{#if showModal}
	<PictureModal {closeModal} bind:adventurePictures={currentVersion.pictures} />
{/if}
