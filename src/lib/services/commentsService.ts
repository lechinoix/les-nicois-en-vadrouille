import type { Comment } from '$lib/types';
import isArray from 'lodash/isArray';
import { createSupabaseClient } from './supabaseService';

export const getAdventureComments = async (adventureId: string): Promise<Comment[]> => {
	const supabaseClient = createSupabaseClient();
	const { data: comments } = await supabaseClient
		.from('Comment')
		.select(`id, content, created_at, user (name)`)
		.eq('article_id', adventureId);

	if (!comments) return [];

	return comments?.map((comment) => ({
		id: String(comment.id),
		createdAt: String(comment.created_at),
		content: String(comment.content),
		username: isArray(comment.user) ? '' : String(comment.user?.name) ?? ''
	}));
};
