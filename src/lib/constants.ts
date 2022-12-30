export enum CardinalPoints {
	N = 'N',
	NE = 'NE',
	E = 'E',
	SE = 'SE',
	S = 'S',
	SW = 'SW',
	W = 'W',
	NW = 'NW'
}

export const TopoSource = {
	C2C: 'camptocamp.org',
	SKITOUR: 'skitour.fr'
};

export enum Sports {
	SKI_ALPIN = 'SKI_ALPIN',
	SKI_DE_RANDO = 'SKI_DE_RANDO',
	ESCALADE_COUENNE = 'ESCALADE_COUENNE',
	ESCALADE_GRANDE_VOIE = 'ESCALADE_GRANDE_VOIE',
	SPELEO = 'SPELEO',
	HIKING = 'HIKING',
	ALPINISM = 'ALPINISM'
}

export enum PicturePosition {
	CENTER = 'CENTER',
	TOP = 'TOP',
	RIGHT = 'RIGHT',
	BOTTOM = 'BOTTOM',
	LEFT = 'LEFT',
	TOP_RIGHT = 'TOP_RIGHT',
	TOP_LEFT = 'TOP_LEFT',
	BOTTOM_LEFT = 'BOTTOM_LEFT',
	BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}

export const iconFillColor = 'rgba(75, 85, 99)';

export const ImageProviders = {
	CLOUDINARY: {
		baseUrl: 'https://res.cloudinary.com'
	},
	GOOGLE_PHOTO: {
		baseUrl: 'https://lh3.googleusercontent.com'
	}
};

export const DEFAULT_DESCRIPTION = "Le site de montagne (et de chill) d'Ambre et Nicolas.";
export const DEFAULT_TITLE = 'Les Niçois en Vadrouille';

export enum CoverTypes {
	LARGE = 'LARGE',
	SMALL = 'SMALL',
	HOME = 'HOME'
}

export const HOMEPAGE_US_IMAGE_URL = `${ImageProviders.CLOUDINARY.baseUrl}/dowsxscl0/image/upload/v1638305939/medium_IMG_0063_2_0c22cc2fb2.jpg`;
export const ALL_ADVENTURES_COVER = {
	formats: {
		thumbnail: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379215/thumbnail_4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
			width: 208,
			height: 156
		},
		xlarge: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379223/xlarge_4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
			width: 1920,
			height: 1440
		},
		medium: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379225/medium_4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
			width: 750,
			height: 563
		},
		small: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379225/small_4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
			width: 500,
			height: 375
		},
		large: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379223/large_4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
			width: 1000,
			height: 750
		}
	},
	url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1650379213/4_FC_06_A84_56_D4_4695_8461_B3_E5_D845_F874_f5c919bf48.jpg',
	width: 4032,
	height: 3024,
	albumId: '',
	id: 336
};
