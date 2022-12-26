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
	import type { Adventure } from '$lib/types';
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
	import { CardinalPoints } from '$lib/constants';
	import Gallery from '$lib/components/gallery/gallery.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let ready: boolean = false;

	let currentVersion: Adventure;

	let orientationOptions = Object.values(CardinalPoints).map((cardinalPoint) => ({
		label: cardinalPoint,
		value: cardinalPoint
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

	onMount(async () => {
		const ongoingDraft = getDraft(data.adventure.id);
		if (ongoingDraft) {
			currentVersion = ongoingDraft;
		} else {
			saveDraft(data.adventure);
			currentVersion = data.adventure;
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
		</div>
		<Gallery />
		<div use:editor />
		<button on:click={submitContent}>Publish</button>
	{/if}
</Container>

<style></style>
