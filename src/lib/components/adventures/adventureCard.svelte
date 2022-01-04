<script lang="ts">
	import { getCoverPicture } from '$lib/services/adventureService';

	import type { Adventure, Picture } from '$lib/types';

	export let adventure: Adventure;
	let coverPicture: Picture | null;

	$: coverPicture = getCoverPicture(adventure);
</script>

<div>
	{#if coverPicture}
		<img src={coverPicture.formats.medium.url} alt={coverPicture.alternativeText} />
	{/if}
	<strong>{adventure.title}</strong>
	<div>Cotation: {adventure.cotation}</div>
	<div>Orientation: {adventure.orientation}</div>
	<p>{adventure.short_description}</p>
</div>
