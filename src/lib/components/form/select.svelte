<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; value: string }[];
	export let name: string;
	export let label: string;
	export let value: string | null;
</script>

<div>
	<label for={name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
	<select
		id={name}
		class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		bind:value
		on:change={() => dispatch('onChange')}
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
