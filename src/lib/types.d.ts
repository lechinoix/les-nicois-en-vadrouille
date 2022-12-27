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
	cover: CoverPicture;
	date: string;
	elevation: number | null;
	orientation: string | null;
	participants: string[] | null;
	places: string[] | null;
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
	id: number | string;
	albumId: string;
} & PictureFormat;

export type Album = {
	id: string;
	shareLink: string;
	title: string;
};

export type PictureFormat = {
	url: string;
	width: number;
	height: number;
};

export type CoverPicture = Picture & {
	position: string | null;
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

export type GooglePhoto = {
	id: string;
	baseLink: string;
	width: number;
	height: number;
	date: number;
};
