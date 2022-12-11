<script context="module" lang="ts">
	import { getAdventureById } from '$lib/services/adventureService';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load({ page }: LoadInput) {
		const adventure = await getAdventureById(page.params.adventureId);
		return {
			props: { adventure }
		};
	}
</script>

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

	export let adventure: Adventure;

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

	onMount(() => {
		const ongoingDraft = getDraft(adventure.id);
		if (ongoingDraft) {
			adventure = ongoingDraft;
		} else {
			saveDraft(adventure);
		}
	});

	function editor(dom: HTMLElement) {
		Editor.make()
			.config((ctx: any) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, adventure.content);
				ctx.get(listenerCtx).markdownUpdated((_: any, markdown: string) => {
					saveDraft({ ...adventure, content: markdown });
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
</script>

<Container>
	<div class="pt-24" use:editor />
	<button on:click={submitContent}>Publish</button>
</Container>

<style></style>
