export const getUrlWithNewSlug = (location: Location, slug: string): string => {
	const urlSlugMatcher = /^(.*)_[a-z-]*$/;
	const urlWithoutSlug = new RegExp(urlSlugMatcher).exec(location.href)[1];

	return `${urlWithoutSlug}_${slug}`;
};
