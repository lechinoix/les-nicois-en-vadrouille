import {
	AdventureStatus,
	CardinalPoints,
	TopoSource,
	PicturePosition,
	Sports
} from '$lib/constants';

/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export type Adventure = AdventureContent & AdventureData;

export type AdventureContent = {
	id: number;
	content: string;
	pictures: Picture[] | null;
	topos: Topo[] | null;
};

export type AdventureData = {
	id: number;
	title: string;
	cotation: string | null;
	cover: CoverPicture | null;
	date: string;
	elevation: number | null;
	orientation: string | null;
	participants: Participant[] | null;
	places: Place[] | null;
	sports: string[] | null;
	periods: string[] | null;
};

export type Topo = {
	url: string;
	source: string;
};

export type Picture = {
	formats: {
		thumbnail: PictureFormat;
		xlarge: PictureFormat | null;
		large: PictureFormat;
		medium: PictureFormat;
		small: PictureFormat;
	};
	id: number;
} & PictureFormat;

export type PictureFormat = {
	url: string;
	width: number;
	height: number;
};

export type CoverPicture = Picture & {
	position: string | null;
};

export type Participant = {
	name: string;
	surname: string;
};

export type Place = {
	name: string | null;
	description: string | null;
	location: string | null;
};

export type Sport = {
	name: string;
	slug: string;
	cover: CoverPicture | null;
};

export type Secrets = {
	githubToken: string;
};
