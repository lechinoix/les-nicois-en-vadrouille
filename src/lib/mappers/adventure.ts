import { AdventureStatus, type Adventure } from '$lib/types';
import type { OutingFragmentFragment } from 'src/gql/graphql';
import { fromGraphQL as fromGraphQLImage } from './image';
import { PicturePosition } from '$lib/constants';
import compact from 'lodash/compact';

const mapStatusToEnum: {[key: string]: AdventureStatus } = {
	[AdventureStatus.ACTIVE]: AdventureStatus.ACTIVE,
	[AdventureStatus.ARCHIVED]: AdventureStatus.ARCHIVED,
	[AdventureStatus.DRAFT]: AdventureStatus.DRAFT
}

export const fromGraphQL = (outingFragment: OutingFragmentFragment): Adventure => {
	return {
		id: outingFragment.id,
		title: outingFragment.title ?? '',
		content: outingFragment.content ?? '',
		cotation: outingFragment.cotation ?? null,
		cover: outingFragment.cover
			? { ...fromGraphQLImage(outingFragment.cover), position: PicturePosition.CENTER }
			: null,
		date: outingFragment.date ?? '',
		elevation: parseInt(outingFragment.elevation ?? ''),
		topos: compact(outingFragment.topos) ?? [],
		orientation: outingFragment.orientation ?? null,
		participants:
			outingFragment.outing_participantCollection?.edges.map(
				(participant) => participant.node.participant.surname ?? ''
			) ?? [],
		periods:
			outingFragment.outing_periodCollection?.edges.map((period) => period.node.period.key) ?? [],
		pictures:
			outingFragment.outing_imageCollection?.edges.map(({ node: { image } }) =>
				fromGraphQLImage(image)
			) ?? [],
		sports: outingFragment.outing_sportCollection?.edges.map((sport) => sport.node.sport.key) ?? [],
		places: outingFragment.outing_placeCollection?.edges.map((place) => place.node.place.key) ?? [],
		status: mapStatusToEnum[outingFragment.status ?? ''],
	};
};
