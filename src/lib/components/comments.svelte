<script lang="ts">
	import type { Comment } from '$lib/types';
	import { addNewComment, getAdventureComments } from '$lib/services/commentsService';
	import { onMount } from 'svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import Input from '$lib/components/form/input.svelte';
	import type { AuthSession } from '@supabase/supabase-js';

	export let adventureId: string;
	export let session: AuthSession;

	let isCommenting = false;
	let ongoingComment = '';
	let comments: Comment[] = [];

	onMount(async () => {
		comments = await getAdventureComments(adventureId);
	});

	const toggleComment = () => {
		isCommenting = true;
	};

	const saveComment = async () => {
		const comment = await addNewComment(adventureId, session.user.id, ongoingComment);
		comments.push(comment);
		isCommenting = false;
		ongoingComment = '';
	};
</script>

{#each comments as comment}
	<div class="py-5">
		<strong>{comment.username}</strong> - {comment.createdAt}
		<br />
		<p>{comment.content}</p>
	</div>
{/each}
{#if session}
	{#if isCommenting}
		<Input label="Your comment" name="comment" bind:value={ongoingComment} />
		<LinkButton on:onClick={saveComment}>Valider</LinkButton>
	{:else}
		<LinkButton on:onClick={toggleComment}>Ajouter commentaire</LinkButton>
	{/if}
{:else}
	<LinkButton url="/login">Connectez-vous pour commenter</LinkButton>
{/if}
