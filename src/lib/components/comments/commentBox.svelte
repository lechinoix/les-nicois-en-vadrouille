<script lang="ts">
	import type { Comment } from '$lib/types';
	import { formatFrenchDate } from '$lib/utils/date';

	export let comment: Comment;

	let initials;

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
<p>
	{comment.content}
</p>
