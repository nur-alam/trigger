import config from '@/config';

export interface EmailLog {
	id: number;
	mail_to: string;
	mail_from: string;
	subject: string;
	message: string;
	created_at: string;
	headers: string;
	attachments: string;
}

export interface PaginationMeta {
	total: number;
	per_page: number;
	current_page: number;
	total_pages: number;
}

export interface EmailSettingsResponse {
	status_code: number;
	message?: string;
	data?: {
		provider?: EmailProviderOptionsType;
		from_name?: string;
		from_email?: string;
		smtp_host?: string;
		smtp_port?: string;
		smtp_security?: SmtpSecurityOptionsType;
		smtp_username?: string;
		smtp_password?: string;
	};
	errors?: Record<string, string[]>;
}

export const redirectUrl = `${config.site_url}/wp-admin/admin.php?page=trigger`;

export type EmailProviderOptionsType = 'smtp' | 'ses' | 'gmail';
export const emailProviderOptions: EmailProviderOptionsType[] = ['smtp', 'ses', 'gmail'];
export const emailProviderAssociatedOptions: { label: string; value: EmailProviderOptionsType }[] = [
	{ label: 'SMTP', value: 'smtp' },
	{ label: 'Amazon SES', value: 'ses' },
	{ label: 'Gmail', value: 'gmail' },
];
// smtp security options
export type SmtpSecurityOptionsType = 'none' | 'ssl' | 'tls';
export const smtpSecurityOptions: SmtpSecurityOptionsType[] = ['none', 'ssl', 'tls'];
export const smtpSecurityAssociatedOptions: { label: string; value: SmtpSecurityOptionsType }[] = [
	{ label: 'None', value: 'none' },
	{ label: 'SSL', value: 'ssl' },
	{ label: 'TLS', value: 'tls' },
];
// smtp port options
export type SmtpPortOptionsType = '25' | '465' | '587'; // todo: to use in validationSchema
export const smtpPortOptions: SmtpPortOptionsType[] = ['25', '465', '587'];

// AWS SES Regions
export type AwsSesRegionOptionsType =
	| 'us-east-1'
	| 'us-east-2'
	| 'us-west-1'
	| 'us-west-2'
	| 'eu-west-1'
	| 'eu-central-1'
	| 'ap-south-1'
	| 'ap-southeast-1'
	| 'ap-southeast-2'
	| 'ap-northeast-1';
export type AwsSesRegionAssociatedOptionsType = {
	value: AwsSesRegionOptionsType;
	label: string;
};

export const AwsSesRegionAssociatedOptions: AwsSesRegionAssociatedOptionsType[] = [
	{ value: 'us-east-1', label: 'US East (N. Virginia)' },
	{ value: 'us-east-2', label: 'US East (Ohio)' },
	{ value: 'us-west-1', label: 'US West (N. California)' },
	{ value: 'us-west-2', label: 'US West (Oregon)' },
	{ value: 'eu-west-1', label: 'EU (Ireland)' },
	{ value: 'eu-central-1', label: 'EU (Frankfurt)' },
	{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
	{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
	{ value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
	{ value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
];

// Response Type
export type TriggerResponseType = {
	status_code: number;
	message: string;
	data: any;
	errors?: Record<string, string[]>;
};

// Verified Email
export type AwsSesVerifiedEmailType = {
	email: string;
	status: string;
};
