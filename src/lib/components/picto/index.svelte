<script lang="ts">
	export let label = '';
</script>

<div class="flex flex-col items-center mx-7">
	<div class="w-16 h-16 rounded-full border border-gray-300 p-4 flex justify-center">
		<slot />
	</div>
	<p class="pt-2 text-sm">{label}</p>
</div>
