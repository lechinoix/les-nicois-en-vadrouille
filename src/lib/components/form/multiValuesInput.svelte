<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from './input.svelte';

	type ValueType = string | number | null;

	export let label: string;
	export let placeholder: string = '';
	export let name: string;
	export let values: ValueType[] | null;
	export let type: 'number' | 'text' | 'date' = 'text';

	const dispatch = createEventDispatcher();

	let currentValue: ValueType;

	const addNewValue = () => {
		if (!values) values = [currentValue];
		values = [...values, currentValue];
		dispatch('valueAdded', currentValue);
		currentValue = '';
	};

	const removeValue = (valueToRemove: ValueType) => {
		if (!values) return;
		values = values.filter((value) => value !== valueToRemove);
	};
</script>

<div>
	<Input
		{label}
		{placeholder}
		{name}
		{type}
		bind:value={currentValue}
		on:dispatchEnter={addNewValue}
	/>
	<button
		class="sm:hidden material-icons text-sm text-white bg-blue-600 rounded-sm p-1 my-1"
		on:click={addNewValue}>add</button
	>
	{#if values}
		{#each values as value}
			<div>
				<button class="material-icons text-sm" on:click={() => removeValue(value)}>close</button>
				{value}
			</div>
		{/each}
	{/if}
</div>
