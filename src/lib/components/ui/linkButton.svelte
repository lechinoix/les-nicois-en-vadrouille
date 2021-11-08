<script lang="ts">
	import type { Link } from '$lib/types';

	export let color: string;
	export let link: Link;
</script>

<a href={link.url} class="bg-{color} px-5 py-2 text-white inline-block rounded" aria-current="page">
	{link.label}
</a>
