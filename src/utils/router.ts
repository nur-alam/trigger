const SLUG = 'trigger';
export const pageUrls = {
	HOME: SLUG,
	SETTINGS: `${SLUG}-settings`,
};

export const router = {
	[pageUrls.HOME]: { pageTitle: 'Trigger', pageContent: 'Home page content' },
	[pageUrls.SETTINGS]: { pageTitle: 'Settings', pageContent: 'Settings page content' },
};
