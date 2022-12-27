<script lang="ts">
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import type { Adventure } from '$lib/types';
	import { clearDraft } from '$lib/services/contentCreationService';

	export let drafts: Adventure[];
</script>

<div class="overflow-x-auto relative">
	<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="py-3 px-6"> Id </th>
				<th scope="col" class="py-3 px-6"> Title </th>
				<th scope="col" class="py-3 px-6" />
				<th scope="col" class="py-3 px-6" />
			</tr>
		</thead>
		<tbody>
			{#each drafts as draft}
				<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
					<th
						scope="row"
						class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						{draft.id}
					</th>
					<td class="py-4 px-6">
						{draft.title}
					</td>
					<td class="py-4 px-6">
						<LinkButton url="/editor/{draft.id}">Edit</LinkButton>
					</td>
					<td class="py-4 px-6">
						<LinkButton onClick={() => clearDraft(draft.id)}>Delete</LinkButton>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
