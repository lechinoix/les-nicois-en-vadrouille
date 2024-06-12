import type { Adventure, Picture } from '$lib/types';
import { slugify } from '$lib/utils/string';
import { ROUTES } from '$lib/config/routes';
import { gql } from '@apollo/client';
import { fromGraphQL } from '$lib/mappers/adventure';
import { graphqlClient } from '$lib/api/supabase';
import type {
	GetAllOutingsQuery,
	GetLatestOutingsQuery,
	GetOutingByIdQuery,
	GetSportOutingsQuery
} from 'src/gql/graphql';
import first from 'lodash/first';

export const IMAGE_FRAGMENT = gql`
	fragment imageFragment on image {
		id
		url
		height
		width
		image_formatCollection {
			edges {
				node {
					url
					height
					width
					format
				}
			}
		}
	}
`;

export const OUTING_FRAGMENT = gql`
	${IMAGE_FRAGMENT}
	fragment outingFragment on outing {
		id
		title
		cotation
		date
		elevation
		orientation
		content
		topos
		status
		cover: image {
			...imageFragment
		}
		outing_imageCollection {
			edges {
				node {
					image {
						...imageFragment
					}
				}
			}
		}
		outing_sportCollection {
			edges {
				node {
					sport {
						key
					}
				}
			}
		}
		outing_participantCollection {
			edges {
				node {
					participant {
						surname
					}
				}
			}
		}
		outing_placeCollection {
			edges {
				node {
					place {
						key
					}
				}
			}
		}
		outing_periodCollection {
			edges {
				node {
					period {
						key
					}
				}
			}
		}
	}
`;

const GET_ALL_OUTINGS = gql`
	${OUTING_FRAGMENT}

	query getAllOutings {
		outingCollection(orderBy: { date: DescNullsLast }) {
			edges {
				node {
					...outingFragment
				}
			}
		}
	}
`;

const GET_LATEST_OUTINGS = gql`
	${OUTING_FRAGMENT}

	query getLatestOutings {
		outingCollection(first: 3, orderBy: { date: DescNullsLast }) {
			edges {
				node {
					...outingFragment
				}
			}
		}
	}
`;

const GET_OUTING_BY_ID = gql`
	${OUTING_FRAGMENT}

	query getOutingById($outingId: String) {
		outingCollection(filter: { id: { eq: $outingId } }) {
			edges {
				node {
					...outingFragment
				}
			}
		}
	}
`;

const GET_OUTINGS_BY_SPORT = gql`
	${OUTING_FRAGMENT}

	query getSportOutings($sportSlug: String) {
		sportCollection(filter: { key: { eq: $sportSlug } }) {
			edges {
				node {
					outing_sportCollection {
						edges {
							node {
								outing {
									...outingFragment
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const getAllAdventures = async (): Promise<Adventure[]> => {
	const response = await graphqlClient<GetAllOutingsQuery>(GET_ALL_OUTINGS, {});

	return response.outingCollection?.edges.map(({ node: outing }) => fromGraphQL(outing)) ?? [];
};

export const getAdventuresDone = getAllAdventures;

export const getLatestAdventures = async (): Promise<Adventure[]> => {
	const response = await graphqlClient<GetLatestOutingsQuery>(GET_LATEST_OUTINGS, {});

	return response.outingCollection?.edges.map(({ node: outing }) => fromGraphQL(outing)) ?? [];
};

export const getAdventureById = async (adventureId: string): Promise<Adventure> => {
	const response = await graphqlClient<GetOutingByIdQuery>(GET_OUTING_BY_ID, {
		variables: { outingId: adventureId }
	});

	const outing = first(response.outingCollection?.edges)?.node;

	if (!outing) {
		throw new Error(`Could not find adventure with id ${adventureId}`);
	}

	return fromGraphQL(outing);
};

export const getAdventureBySportSlug = async (sportSlug: string): Promise<Adventure[]> => {
	const response = await graphqlClient<GetSportOutingsQuery>(GET_OUTINGS_BY_SPORT, {
		variables: { sportSlug }
	});

	const sport = first(response.sportCollection?.edges);

	return sport?.node.outing_sportCollection?.edges.map(({ node: { outing } }) =>
		fromGraphQL(outing)
	) ?? [];
};

export const getCoverPicture = (adventure: Adventure): Picture | null =>
	adventure.cover ? adventure.cover : null;

export const getAdventurePageUrl = (adventure: Adventure) =>
	`${ROUTES.ADVENTURES.BY_ID}${adventure.id}_${slugify(adventure.title)}`;
