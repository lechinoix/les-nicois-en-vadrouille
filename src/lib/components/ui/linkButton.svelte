<script lang="ts">
	export let color: string;
	export let url: string;
	export let label: string;
</script>

<a href={url} class="bg-{color} px-5 py-2 text-white inline-block rounded" aria-current="page">
	{label}
</a>
