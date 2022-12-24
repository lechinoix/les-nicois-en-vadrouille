<script lang="ts">
	export let paddingHeader = false;
</script>

<div class={`my-5 container mx-auto max-w-4xl px-5 ${paddingHeader ? 'pt-24' : ''}`}>
	<slot />
</div>
