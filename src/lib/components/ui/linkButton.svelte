<script lang="ts">
	export let url: string | null = null;
	export let onClick: (() => void) | null = null;
	export let parentClass: string;
	export let isPrimary: boolean = true;
	export { parentClass as class };
	export let target: string = '';
</script>

{#if onClick}
	<button
		on:click={onClick}
		class="{parentClass ?? ''} {isPrimary
			? `bg-blue-500 text-white`
			: `text-blue-500 bg-white border-2 border-blue-500`} px-5 py-2 inline-block rounded"
	>
		<slot />
	</button>
{/if}

{#if url}
	<a
		href={url}
		{target}
		class="{parentClass ?? ''} {isPrimary
			? `bg-blue-500 text-white`
			: `text-blue-500 bg-white`} px-5 py-2 inline-block rounded"
	>
		<slot />
	</a>
{/if}
