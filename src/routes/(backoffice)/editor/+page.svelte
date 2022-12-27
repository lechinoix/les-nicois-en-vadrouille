<script lang="ts">
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { createNewDraft, getAllDrafts } from '$lib/services/contentCreationService';
	import { goto } from '$app/navigation';
	import DraftList from './draftList.svelte';
	import Container from '$lib/components/container.svelte';

	const drafts = getAllDrafts();

	const startNew = () => {
		const adventureId = createNewDraft();
		goto(`/editor/${adventureId}`);
	};
</script>

<Container>
	<LinkButton onClick={startNew}>Start new adventure</LinkButton>
	<h2 class="my-3">Open drafts</h2>
	<DraftList {drafts} />
</Container>
