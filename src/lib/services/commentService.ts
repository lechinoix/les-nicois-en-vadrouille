import config from '$lib/config';
import { nanoid } from 'nanoid';

type CommentPayload = {
	name: string;
	mail: string;
	content: string;
	adventureId: number;
};

const formatCommentPayloadFromAdventureForm = (input: CommentPayload) => ({
	authorId: nanoid(),
	authorName: input.name,
	authorEmail: input.mail,
	content: input.content,
	related: [
		{
			refId: input.adventureId,
			ref: 'adventure',
			field: 'comments'
		}
	]
});

export const postComment = async (input: CommentPayload): Promise<Comment> => {
	const res = await fetch(`${config.BASE_API_URL}/comments/adventure:${input.adventureId}`, {
		method: 'POST',
		body: JSON.stringify(formatCommentPayloadFromAdventureForm(input)),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) throw new Error(res.statusText);

	return await res.json();
};
