import Trigger from '@/pages/trigger';
import Settings from '@pages/settings';
import EmailLogs from '@pages/email-logs';
const SLUG = 'trigger';

export const pageUrls = {
	TRIGGER: SLUG,
	EMAIL_LOGS: `${SLUG}-email-logs`,
	SETTINGS: `${SLUG}-settings`,
};

export const router = {
	[pageUrls.TRIGGER]: { pageTitle: 'Trigger', pageContent: <Trigger /> },
	[pageUrls.EMAIL_LOGS]: { pageTitle: 'Email Logs', pageContent: <EmailLogs /> },
	[pageUrls.SETTINGS]: { pageTitle: 'Settings', pageContent: <Settings /> },
};
