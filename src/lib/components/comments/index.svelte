<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { email, required } from 'svelte-forms/validators';

	const name = field('name', '', [required()]);
	const emailInput = field('email', '', [email(), required()]);
	const content = field('content', '', [required()]);
	const commentForm = form(name, emailInput, content);
</script>

<section class="flex flex-col items-start">
	<label for="name">Name</label>
	<input type="text" bind:value={$name.value} id="name" class="border mb-5" />
	<label for="email">Email</label>
	{#if $commentForm.hasError('emailInput.email') || $commentForm.hasError('emailInput.required')}
		<div>Email is invalid</div>
	{/if}
	<input type="email" bind:value={$emailInput.value} id="email" class="border mb-5" />
	<label for="content">Your comment</label>
	<textarea bind:value={$content.value} id="content" class="border mb-5" />

	<button disabled={!$commentForm.valid} class="border px-5 py-2 bg-gray-200">Send</button>
</section>
