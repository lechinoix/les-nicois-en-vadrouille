import type { Picture } from '$lib/types';
import keyBy from 'lodash/keyBy';
import type { ImageFragmentFragment } from 'src/gql/graphql';

export const fromGraphQL = (imageFragment: ImageFragmentFragment): Picture => {
	return {
		id: imageFragment.id,
		url: imageFragment.url,
		height: parseInt(imageFragment.height ?? ''),
		width: parseInt(imageFragment.width ?? ''),
		formats: keyBy(
			imageFragment.image_formatCollection?.edges.map(({ node: format }) => {
				return {
					url: format.url,
					height: parseInt(format.height ?? ''),
					width: parseInt(format.width ?? ''),
					format: format.format
				};
			}),
			'format'
		) as unknown as Picture['formats']
	};
};
