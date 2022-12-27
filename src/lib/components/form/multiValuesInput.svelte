<script lang="ts">
	import Input from './input.svelte';

	type ValueType = string | number | null;

	export let label: string;
	export let placeholder: string = '';
	export let name: string;
	export let values: ValueType[] | null;
	export let type: 'number' | 'text' | 'date' = 'text';

	let currentValue: ValueType;

	const addNewValue = () => {
		if (!values) values = [currentValue];
		values = [...values, currentValue];
		currentValue = '';
	};

	const removeValue = (valueToRemove: ValueType) => {
		if (!values) return;
		values = values.filter((value) => value !== valueToRemove);
	};
</script>

<div class="mb-6">
	<Input
		{label}
		{placeholder}
		{name}
		{type}
		bind:value={currentValue}
		on:dispatchEnter={addNewValue}
	/>
	{#if values}
		{#each values as value}
			<div>
				<span class="material-icons text-sm" on:click={() => removeValue(value)}>close</span>
				{value}
			</div>
		{/each}
	{/if}
</div>
