<script lang="ts">
	import Select from './select.svelte';

	export let label: string;
	export let name: string;
	export let values: string[] | null;
	export let options: { label: string; value: string }[];

	let currentValue: string;

	const addNewValue = () => {
		if (!values) values = [currentValue];
		values = [...values, currentValue];
		currentValue = '';
	};

	const removeValue = (valueToRemove: string) => {
		if (!values) return;
		values = values.filter((value) => value !== valueToRemove);
	};
</script>

<div>
	<Select {label} {options} {name} bind:value={currentValue} on:dispatchEnter={addNewValue} />
	{#if values}
		{#each values as value}
			<div>
				<span class="material-icons text-sm" on:click={() => removeValue(value)}>close</span>
				{value}
			</div>
		{/each}
	{/if}
</div>
