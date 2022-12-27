import { PicturePosition } from '$lib/constants';
import type { CoverPicture } from '$lib/types';

const DEFAULT_POSITION = 'object-center';

const postitionToStyle = {
	[PicturePosition.CENTER]: DEFAULT_POSITION,
	[PicturePosition.BOTTOM]: 'object-bottom',
	[PicturePosition.LEFT]: 'object-left',
	[PicturePosition.BOTTOM_LEFT]: 'object-left-bottom',
	[PicturePosition.TOP_LEFT]: 'object-left-top',
	[PicturePosition.RIGHT]: 'object-right',
	[PicturePosition.BOTTOM_RIGHT]: 'object-right-bottom',
	[PicturePosition.TOP_RIGHT]: 'object-right-top',
	[PicturePosition.TOP]: 'object-top'
};

export const getCoverPositionStyle = (position: PicturePosition | null): string => {
	if (!position) return DEFAULT_POSITION;
	return postitionToStyle[position];
};

export const getHomepageCover = (): CoverPicture => ({
	formats: {
		thumbnail: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295015/thumbnail_monaco_2bdf322c6b.jpg',
			width: 245,
			height: 138
		},
		xlarge: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295016/xlarge_monaco_2bdf322c6b.jpg',
			width: 1920,
			height: 1078
		},
		medium: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295017/medium_monaco_2bdf322c6b.jpg',
			width: 750,
			height: 421
		},
		small: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295017/small_monaco_2bdf322c6b.jpg',
			width: 500,
			height: 281
		},
		large: {
			url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295016/large_monaco_2bdf322c6b.jpg',
			width: 1000,
			height: 562
		}
	},
	url: 'https://res.cloudinary.com/dowsxscl0/image/upload/v1640295015/monaco_2bdf322c6b.jpg',
	width: 2048,
	height: 1150,
	id: 121,
	albumId: '',
	position: PicturePosition.CENTER.toString()
});
