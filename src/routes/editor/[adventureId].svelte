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
	import { getAdventureById } from '$lib/services/adventureService';
	import { page } from '$app/stores';

	export let adventure: Adventure;
	export let ready: boolean = false;

	export let submitContent = async () => {
		const ongoingDraft = getDraft(adventure.id);
		if (!ongoingDraft) throw new Error('Failed to read ongoing draft');
		if (isEqual(ongoingDraft, adventure)) {
			console.log('No changes to publish');
			return;
		}

		await publishContent(ongoingDraft);
		clearDraft(adventure.id);
	};

	onMount(async () => {
		const adventureId = Number($page.params.adventureId);
		const ongoingDraft = getDraft(adventureId);
		if (ongoingDraft) {
			adventure = ongoingDraft;
		} else {
			const adventure = await getAdventureById(adventureId);
			saveDraft(adventure);
		}
		ready = true;
	});

	function editor(dom: HTMLElement) {
		Editor.make()
			.config((ctx: any) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, adventure.content);
				ctx.get(listenerCtx).markdownUpdated((_: any, markdown: string) => {
					adventure.content = markdown;
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

	$: if (ready) saveDraft(adventure);
</script>

<Container paddingHeader={true}>
	{#if ready}
		<Input name="title" label="Titre" bind:value={adventure.title} />
		<div use:editor />
		<button on:click={submitContent}>Publish</button>
	{/if}
</Container>

<style></style>
