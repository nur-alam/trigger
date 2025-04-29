import config from "@/config";

export function getSlugFromUrl(url: string = '', slug: string = 'page'): string {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug) || '';
	}
	return '';
}

export const getProviderFullName = (provider: string): string => {
	const providerMap: { [key: string]: string } = {
		'ses': 'Amazon SES',
		'smtp': 'SMTP',
		'sendgrid': 'SendGrid',
		'mailgun': 'Mailgun',
		'postmark': 'Postmark',
		'sparkpost': 'SparkPost',
		'mailchimp': 'Mailchimp',
		'sendinblue': 'Sendinblue',
		'gmail': 'Gmail',
		'outlook': 'Microsoft Outlook',
		'yahoo': 'Yahoo Mail',
	};

	return providerMap[provider.toLowerCase()] || provider;
};