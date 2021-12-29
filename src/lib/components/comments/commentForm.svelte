<script lang="ts">
	import { postComment } from '$lib/services/commentService';
	import type { Comment } from '$lib/types';
	import { form, field } from 'svelte-forms';
	import { email, required } from 'svelte-forms/validators';

	export let adventureId: number;
	export let onSuccess: (comment: Comment) => void;

	const name = field('name', '', [required()]);
	const emailInput = field('emailInput', '', [email(), required()]);
	const content = field('content', '', [required()]);
	const commentForm = form(name, emailInput, content);

	let errorOnSave = false;

	const formatPayloadFromForm = () => ({
		name: $name.value,
		mail: $emailInput.value,
		content: $content.value,
		adventureId
	});

	const submitForm = async () => {
		errorOnSave = false;
		await commentForm.validate();
		if (!$commentForm.valid) return;

		try {
			const comment = await postComment(formatPayloadFromForm());
			onSuccess(comment);
		} catch (e) {
			console.error(e);
			errorOnSave = true;
		}
	};
</script>

<section class="flex flex-col items-start">
	<label for="name">Name</label>
	{#if $commentForm.hasError('name.required')}
		<div class="text-red-600 text-sm">Entrez votre nom / prénom (ou pseudo)</div>
	{/if}
	<input type="text" bind:value={$name.value} id="name" class="border mb-5" />
	<label for="email">Email</label>
	{#if $commentForm.hasError('emailInput.not_an_email') || $commentForm.hasError('emailInput.required')}
		<div class="text-red-600 text-sm">L'email est obligatoire</div>
	{/if}
	<input type="email" bind:value={$emailInput.value} id="email" class="border mb-5" />
	<label for="content">Votre commentaire</label>
	{#if $commentForm.hasError('content.required')}
		<div class="text-red-600 text-sm">Le texte ne peut pas être vide</div>
	{/if}
	<textarea bind:value={$content.value} id="content" class="border mb-5" />

	{#if errorOnSave}
		<div class="text-red-600 text-sm">Une erreur est survenue, réssayez plus tard</div>
	{/if}
	<button on:click={submitForm} class="border px-5 py-2 bg-gray-200">Send</button>
</section>
