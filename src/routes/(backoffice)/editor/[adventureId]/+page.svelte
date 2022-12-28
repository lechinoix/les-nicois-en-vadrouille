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
	import { CardinalPoints, PicturePosition, Sports } from '$lib/constants';
	import type { PageData } from './$types';
	import PictureModal from './pictureModal.svelte';
	import SelectableGallery from '$lib/components/gallery/selectableGallery.svelte';
	import MultiValuesInput from '$lib/components/form/multiValuesInput.svelte';
	import MultiValuesSelect from '$lib/components/form/multiValuesSelect.svelte';
	import { getAllPlaces } from '$lib/services/placeService';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { getPassword } from '$lib/services/secretsService';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let ready: boolean = false;

	let loading: boolean = false;
	let error: boolean = false;
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

	const sportOptions = Object.values(Sports).map((sport) => ({
		label: sport,
		value: sport
	}));

	const placeOptions = getAllPlaces().map((place) => ({
		label: place.name,
		value: place.name
	}));

	export let submitContent = async () => {
		const ongoingDraft = getDraft(data.adventureId);
		if (!ongoingDraft) throw new Error('Failed to read ongoing draft');
		if (isEqual(ongoingDraft, data.adventure)) {
			console.log('No changes to publish');
			return;
		}

		try {
			error = false;
			loading = true;
			await publishContent(ongoingDraft);
			goto('/editor').then(() => clearDraft(data.adventureId));
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	};

	const resetDraft = () => {
		clearDraft(data.adventureId);
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
			position: currentVersion.cover?.position ?? null
		};
		currentVersion = {
			...currentVersion,
			cover
		};
	};

	onMount(async () => {
		const ongoingDraft = getDraft(data.adventureId);
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
{#if !getPassword()}
	Cannot access editor page without a password
{:else}
	<Container>
		{#if ready}
			<div class="mb-6"><Input name="title" label="Titre" bind:value={currentVersion.title} /></div>
			<div class="flex flex-row flex-wrap gap-5 mb-6">
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
			<div class="flex flex-row flex-wrap gap-5 mb-6">
				<MultiValuesInput
					type="text"
					name="participants"
					label="Participants"
					bind:values={currentVersion.participants}
				/>
				<MultiValuesSelect
					options={sportOptions}
					name="sports"
					label="Sports"
					bind:values={currentVersion.sports}
				/>
				<MultiValuesSelect
					options={placeOptions}
					name="places"
					label="Places"
					bind:values={currentVersion.places}
				/>
			</div>
			{#if currentVersion.cover}
				<Select
					name="cover-position"
					label="Cover Position"
					options={picturePositionOptions}
					bind:value={currentVersion.cover.position}
				/>
			{/if}
			<LinkButton class="my-2" onClick={openModal}>Modify pictures</LinkButton>
			<SelectableGallery
				pictures={currentVersion.pictures ?? []}
				selectedPictures={[currentVersion.cover?.id ?? '']}
				on:clickPicture={changeCover}
			/>
			<div class="mt-5">
				<p class="text-md mb-2">Content</p>
				<div use:editor />
			</div>
			<MultiValuesInput
				type="text"
				name="topos"
				label="External Links"
				bind:values={currentVersion.topos}
			/>
		{/if}
	</Container>

	<div class="fixed bottom-0 p-5 bg-white flex items-center justify-center gap-2">
		<LinkButton onClick={submitContent}>{loading ? 'Publishing...' : 'Publish'}</LinkButton>
		{#if error}
			<p class="text-red-600">Something bad happened...</p>
		{/if}
		<LinkButton onClick={resetDraft}>Reset</LinkButton>
		<LinkButton url="/editor/{data.adventureId}/preview" target="_blank">Preview</LinkButton>
	</div>

	{#if showModal}
		<PictureModal {closeModal} bind:adventurePictures={currentVersion.pictures} />
	{/if}
{/if}
