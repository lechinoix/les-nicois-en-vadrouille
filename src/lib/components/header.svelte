<script lang="ts">
	import { ROUTES } from '$lib/config/routes';
	import LinkButton from './ui/linkButton.svelte';
</script>

<nav class="bg-white border-gray-200 border-b my-5 pb-3">
	<div class="container mx-auto flex flex-wrap justify-between">
		<a href={ROUTES.HOME} class="flex mb-3">
			<span class="self-center text-2xl font-semibold whitespace-nowrap">
				Our Little Adventures
			</span>
		</a>
		<ul class="flex-row flex space-x-4">
			<li>
				<LinkButton url={ROUTES.ADVENTURES.DONE} color="green-500" content="Done" />
			</li>
			<li>
				<LinkButton url={ROUTES.ADVENTURES.PLANNED} color="blue-500" content="Planned" />
			</li>
			<li>
				<LinkButton url={ROUTES.ADVENTURES.TODO} color="orange-500" content="Todo" />
			</li>
		</ul>
	</div>
</nav>
