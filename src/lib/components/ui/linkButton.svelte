<script lang="ts">
	export let url: string;
	export let color: string;
	export let content: string;
</script>

<a href={url} class="bg-{color}-700 px-5 py-2 text-white block rounded" aria-current="page">
	{content}
</a>
