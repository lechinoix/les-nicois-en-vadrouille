<script lang="ts">
	export let className: string = '';
</script>

<p class={`text-justify text-gray-600 text-xl font-serif font-light leading-relaxed ${className}`}>
	<slot />
</p>
