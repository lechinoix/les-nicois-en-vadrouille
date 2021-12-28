<script lang="ts">
	import type { Comment } from '$lib/types';
	import { formatFrenchDate } from '$lib/utils/date';

	export let comment: Comment;
</script>

<p>Author: {comment.authorName}</p>
<p>Date: {formatFrenchDate(comment.created_at)}</p>
<p>
	{comment.content}
</p>
