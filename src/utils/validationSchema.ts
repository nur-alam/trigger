import { z } from 'zod';

const emailProviderSchema = z.enum(['smtp', 'ses']);

const smtpConfigSchema = z.object({
	smtpHost: z.string().min(1, { message: 'SMTP Host is required' }),
	smtpPort: z.string().min(1, { message: 'SMTP Port is required' }),
	smtpSecurity: z.string().min(1, { message: 'SMTP Security is required' }),
	smtpUsername: z.string().min(1, { message: 'SMTP Username is required' }),
	smtpPassword: z.string().min(1, { message: 'SMTP Password is required' }),
});

const sesConfigSchema = z.object({
	accessKeyId: z.string().min(1, { message: 'Access Key ID is required' }),
	secretAccessKey: z.string().min(1, { message: 'Secret Access Key is required' }),
	region: z.string().min(1, { message: 'Region is required' }),
});

// Define the validation schema
export const emailConfigSchema = z
	.object({
		provider: emailProviderSchema,
		fromName: z.string().min(1, { message: 'From Name is required' }),
		fromEmail: z.string().email({ message: 'Invalid email address' }),
		smtp: smtpConfigSchema.optional(),
		ses: sesConfigSchema.optional(),
	})
	.refine(
		(data) => {
			if (data.provider === 'smtp') {
				return !!data.smtp;
			}
			if (data.provider === 'ses') {
				return !!data.ses;
			}
			return false;
		},
		{
			message: 'Configuration is required for the selected provider',
		}
	);

export type EmailConfigFormValues = z.infer<typeof emailConfigSchema>;
