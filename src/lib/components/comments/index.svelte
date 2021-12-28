<script lang="ts">
	import { postComment } from '$lib/services/commentService';
	import { form, field } from 'svelte-forms';
	import { email, required } from 'svelte-forms/validators';

	export let adventureId: number;

	const name = field('name', '', [required()]);
	const emailInput = field('email', '', [email(), required()]);
	const content = field('content', '', [required()]);
	const commentForm = form(name, emailInput, content);

	const formatPayloadFromForm = () => ({
		name: $name.value,
		mail: $emailInput.value,
		content: $content.value,
		adventureId
	});

	const submitForm = async () => {
		return await postComment(formatPayloadFromForm());
	};
</script>

<section class="flex flex-col items-start">
	<label for="name">Name</label>
	<input type="text" bind:value={$name.value} id="name" class="border mb-5" />
	<label for="email">Email</label>
	<!-- {#if $commentForm.hasError('emailInput.email') || $commentForm.hasError('emailInput.required')}
		<div>Email is invalid</div>
	{/if} -->
	<input type="email" bind:value={$emailInput.value} id="email" class="border mb-5" />
	<label for="content">Your comment</label>
	<textarea bind:value={$content.value} id="content" class="border mb-5" />

	<button on:click={submitForm} class="border px-5 py-2 bg-gray-200">Send</button>
</section>
