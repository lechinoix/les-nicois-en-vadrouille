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

	export let adventure: Adventure;

	function editor(dom: HTMLElement) {
		Editor.make()
			.config((ctx: any) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, adventure.content);
				ctx.get(listenerCtx).markdownUpdated((_, markdown: string) => {
					console.log(markdown);
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
</Container>

<style></style>
