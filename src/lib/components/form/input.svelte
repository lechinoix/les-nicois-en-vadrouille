<script lang="ts">
	export let label: string;
	export let placeholder: string = '';
	export let name: string;
	export let required: boolean = false;
	export let value: string | number | null;
	export let type: 'number' | 'text' = 'text';
</script>

<div class="mb-6">
	<label for={name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
	{#if type == 'text'}
		<input
			type="text"
			id={name}
			{placeholder}
			{required}
			bind:value
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		/>
	{/if}
	{#if type == 'number'}
		<input
			type="number"
			id={name}
			{placeholder}
			{required}
			bind:value
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		/>
	{/if}
</div>
