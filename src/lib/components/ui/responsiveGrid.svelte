<script lang="ts">
	export let items: { component: any; props: {}; key: string }[];
</script>

<div class="responsive-grid">
	{#each items as item (item.key)}
		<div class="responsive-grid__item">
			<div class="responsive-grid__item-content">
				<svelte:component this={item.component} {...item.props} />
			</div>
		</div>
	{/each}
</div>

<style>
	.responsive-grid {
		display: grid;
		grid-gap: 16px;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	}

	.responsive-grid__item {
		position: relative;
		padding-bottom: 50%;
	}

	.responsive-grid__item-content {
		position: absolute;
		height: 100%;
		width: 100%;
	}
</style>
