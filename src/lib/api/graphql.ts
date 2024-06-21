import type { TypedDocumentNode } from '@apollo/client';
import { print } from 'graphql';
import uniqBy from 'lodash/uniqBy';
import { publicSupabase } from './supabase';

export const createSupabaseGraphQLClient =
	() =>
	async <TResult, TVariables = Record<string, string>>(
		query: TypedDocumentNode<TResult, TVariables>,
		{ variables, headers }: { variables?: TVariables; headers?: Headers }
	): Promise<TResult> => {
		const token = (await publicSupabase.auth.getSession()).data.session?.access_token;

		const headerEntries = uniqBy(
			[
				...(headers ? headers.entries() : []),
				['Authorization', `Bearer ${token}`],
				['Content-Type', 'application/json']
			],
			(entry: [string, string]) => entry[0]
		);

		const promise = fetch('https://mxhdhwaoueiiehyajavu.supabase.co/graphql/v1', {
			method: 'POST',
			headers: new Headers(headerEntries),
			body: JSON.stringify({ query: print(query), variables })
		});

		const result = await promise;

		const { data, errors } = await result.json();

		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		if (errors) {
			throw errors;
		}

		return data;
	};
