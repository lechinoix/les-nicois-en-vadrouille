<script lang="ts">
	import { iconFillColor } from '$lib/constants';

	export let label = '';
</script>

<div class="max-w-20 flex flex-col items-center flex-shrink-0">
	<div class="w-16 h-16">
		<slot />
	</div>
	<p class="pt-2 text-sm text-center font-sans" style={`color: ${iconFillColor}`}>{label}</p>
</div>

<style>
	.max-w-20 {
		max-width: 5rem;
	}
</style>
