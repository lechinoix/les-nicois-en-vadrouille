<script lang="ts">
	import { reportComment } from '$lib/services/commentService';
	import type { Comment } from '$lib/types';
	import { formatFrenchDate } from '$lib/utils/date';

	export let comment: Comment;
	export let adventureId: number;

	let initials;
	let reportSucceeded = false;
	let reportFailed = false;

	const reportCommentAction = async () => {
		reportFailed = false;
		reportSucceeded = false;
		try {
			await reportComment(adventureId, comment.id);
			reportSucceeded = true;
		} catch (e) {
			console.error(e);
			reportFailed = true;
		}
	};

	$: initials = comment.authorName
		.split(' ')
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
</script>

<div class="flex h-8">
	<div class="text-l w-8 h-8 flex items-center justify-center border border-gray-300">
		{initials}
	</div>
	<div class="bg-gray-300 flex justify-between items-center flex-grow px-2 text-gray-500 text-xs">
		<div>{comment.authorName}</div>
		<div>{formatFrenchDate(comment.created_at)}</div>
	</div>
</div>
<div class="flex mx-4 my-3 flex-col">
	<p>{comment.content}</p>
	<button on:click={reportCommentAction} class="text-gray-400 text-xs self-start mt-2"
		>Ask for deletion</button
	>
	{#if reportSucceeded}
		<p class="text-xs text-green-600">Votre demande a été prise en compte</p>
	{/if}
	{#if reportFailed}
		<p class="text-xs text-red-600">Votre demande n'a pas pu être prise en compte</p>
	{/if}
</div>
