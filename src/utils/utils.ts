export function getSlugFromUrl(url: string, slug: string = 'page') {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug);
	}
}
