<script lang="ts">
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { createNewDraft } from '$lib/services/contentCreationService';
	import { goto } from '$app/navigation';

	const startNew = () => {
		const adventureId = createNewDraft();
		goto(`/editor/${adventureId}`);
	};
</script>

<LinkButton onClick={startNew}>Start new adventure</LinkButton>
