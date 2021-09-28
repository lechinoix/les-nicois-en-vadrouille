<script lang="ts">
	import { ROUTES } from '$lib/config/routes';
	import LinkButton from './ui/linkButton.svelte';
</script>

<nav class="bg-white border-gray-200 my-5">
	<div class="container mx-auto flex flex-wrap justify-between">
		<a href={ROUTES.HOME} class="flex mb-5">
			<span class="self-center text-2xl font-semibold whitespace-nowrap">
				Our Little Adventures
			</span>
		</a>
		<button
			data-collapse-toggle="mobile-menu"
			type="button"
			class="md:hidden ml-3 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center"
			aria-controls="mobile-menu-2"
			aria-expanded="false"
		>
			<span class="sr-only">Open main menu</span>
			<svg
				class="w-6 h-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/></svg
			>
			<svg
				class="hidden w-6 h-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
		<div class="hidden md:block w-full" id="mobile-menu">
			<ul
				class="flex-col xsm:space-y-2 md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium md:items-center md:justify-items-center"
			>
				<li>
					<LinkButton url={ROUTES.ADVENTURES.DONE} color="green" content="Done" />
				</li>
				<li>
					<LinkButton url={ROUTES.ADVENTURES.PLANNED} color="blue" content="Planned" />
				</li>
				<li>
					<LinkButton url={ROUTES.ADVENTURES.TODO} color="red" content="Todo" />
				</li>
			</ul>
		</div>
	</div>
</nav>
