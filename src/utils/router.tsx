import Trigger from '@pages/trigger';
import Settings from '@pages/settings';

const SLUG = 'trigger';

export const pageUrls = {
	TRIGGER: SLUG,
	SETTINGS: `${SLUG}-settings`,
};

export const router = {
	[pageUrls.TRIGGER]: { pageTitle: 'Email Logs', pageContent: <Trigger /> },
	[pageUrls.SETTINGS]: { pageTitle: 'Settings', pageContent: <Settings /> },
};
