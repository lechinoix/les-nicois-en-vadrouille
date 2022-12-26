<script lang="ts">
	import AdventurePage from './adventurePage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<AdventurePage adventure={data.adventure} />
