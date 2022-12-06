<script lang="ts">
	import { getCoverPicture } from '$lib/services/adventureService';

	import type { Adventure, Picture } from '$lib/types';

	export let adventure: Adventure;
	let coverPicture: Picture | null;

	$: coverPicture = getCoverPicture(adventure);
</script>

<div class="flex my-5">
	<div class="w-40 h-24 overflow-hidden rounded-xl flex-shrink-0">
		{#if coverPicture}
			<img class="object-cover w-full" src={coverPicture.formats.thumbnail.url} />
		{/if}
	</div>
	<div class="ml-3">
		<strong>{adventure.title}</strong>
		{#if adventure.cotation}
			<div>Cotation: {adventure.cotation}</div>
		{/if}
		{#if adventure.orientation}
			<div>Orientation: {adventure.orientation}</div>
		{/if}
	</div>
</div>
