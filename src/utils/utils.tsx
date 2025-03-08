export function getSlugFromUrl(url: string = '', slug: string = 'page'): string {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug) || '';
	}
	return '';
}
