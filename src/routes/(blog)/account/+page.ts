import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const prerender = true;
export const load: PageLoad = async ({ data }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (!data?.session) throw redirect(307, '/login');
};
