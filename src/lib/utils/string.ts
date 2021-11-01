export const truncateText = (text: string, limit = 200): string =>
	text.length > limit ? `${text.slice(0, limit)}...` : text;
