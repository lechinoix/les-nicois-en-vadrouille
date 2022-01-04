<script lang="ts">
	import type { Adventure } from '$lib/types';

	export let adventure: Adventure;
</script>

<div>
	<img
		src={adventure.cover_picture.picture.formats.medium.url}
		alt={adventure.cover_picture.picture.alternativeText}
	/>
	<strong>{adventure.title}</strong>
	<div>Cotation: {adventure.cotation}</div>
	<div>Orientation: {adventure.orientation}</div>
	<p>{adventure.short_description}</p>
</div>
