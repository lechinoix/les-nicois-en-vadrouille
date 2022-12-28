<script lang="ts">
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { createNewDraft, getAllDrafts } from '$lib/services/contentCreationService';
	import { goto } from '$app/navigation';
	import DraftList from './draftList.svelte';
	import Container from '$lib/components/container.svelte';
	import type { Adventure } from '$lib/types';
	import { onMount } from 'svelte';
	import Search from '$lib/components/search.svelte';

	let drafts: Adventure[] = [];

	onMount(() => {
		setDrafts();
	});

	const setDrafts = () => {
		drafts = getAllDrafts();
	};

	const startNew = () => {
		const adventureId = createNewDraft();
		goto(`/editor/${adventureId}`);
	};
</script>

<svelte:window on:storage={setDrafts} />

<Container>
	<h2 class="my-3">Edit existing adventure</h2>
	<Search />
	<LinkButton onClick={startNew}>Start new adventure</LinkButton>
	<h2 class="my-3">Open drafts</h2>
	<DraftList {drafts} />
</Container>
