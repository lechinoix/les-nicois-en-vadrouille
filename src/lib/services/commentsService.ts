import type { Comment } from '$lib/types';
import isArray from 'lodash/isArray';
import { supabase } from '$lib/supabaseClient';

const mapSupabaseComment = (comment: any): Comment => ({
	id: String(comment.id),
	createdAt: String(comment.created_at),
	content: String(comment.content),
	username: isArray(comment.user) ? '' : String(comment.user?.name) ?? ''
});

export const addNewComment = async (
	adventureId: string,
	userId: string,
	content: string
): Promise<Comment> =>
	mapSupabaseComment(
		supabase.from('Comment').insert({ articleId: adventureId, user: userId, content }).select()
	);

export const getAdventureComments = async (adventureId: string): Promise<Comment[]> => {
	const { data: comments } = await supabase
		.from('Comment')
		.select(`id, content, created_at, user (name)`)
		.eq('article_id', adventureId);

	if (!comments) return [];

	return comments?.map(mapSupabaseComment);
};
