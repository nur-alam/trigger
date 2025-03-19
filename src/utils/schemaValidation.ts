import { z } from 'zod';
import {
	smtpSecurityOptions,
	emailProviderOptions,
	SmtpSecurityOptionsType,
	EmailProviderOptionsType,
	smtpPortOptions,
	SmtpPortOptionsType,
} from './trigger-declaration';
// todo smtp port validation with smtpPortOptions

export const emailProviderSchema = z.enum(
	emailProviderOptions as [EmailProviderOptionsType, ...EmailProviderOptionsType[]],
	{
		message: 'Email Provider is required',
	}
);

const smtpSecuritySchema = z
	.enum(smtpSecurityOptions as [SmtpSecurityOptionsType, ...SmtpSecurityOptionsType[]], {
		message: "SMTP Security isn't required!",
	})
	.default('tls');

const smtpPortSchema = z.enum(smtpPortOptions as [SmtpPortOptionsType, ...SmtpPortOptionsType[]], {
	message: "SMTP port isn't valid!",
});

export const smtpConfigSchema = z.object({
	provider: emailProviderSchema,
	fromName: z.string().min(1, { message: 'From Name is required' }),
	fromEmail: z.string().email({ message: 'Invalid email address' }),
	smtpHost: z.string().min(1, { message: 'SMTP Host is required' }),
	smtpPort: smtpPortSchema,
	smtpSecurity: smtpSecuritySchema,
	smtpUsername: z.string().min(1, { message: 'SMTP Username is required' }),
	smtpPassword: z.string().min(1, { message: 'SMTP Password is required' }),
});

export type SmtpConfigFormValues = z.infer<typeof smtpConfigSchema>;

export const sesConfigSchema = z.object({
	provider: emailProviderSchema,
	fromName: z.string().min(1, { message: 'From Name is required' }),
	fromEmail: z.string().email({ message: 'Invalid email address' }),
	accessKeyId: z.string().min(1, { message: 'Access Key ID is required' }),
	secretAccessKey: z.string().min(1, { message: 'Secret Access Key is required' }),
	region: z.string().min(1, { message: 'Region is required' }),
});

export type SesConfigFormValues = z.infer<typeof sesConfigSchema>;

// Define the validation schema
// export const emailConfigSchema = z
// 	.object({
// 		provider: emailProviderSchema,
// 		fromName: z.string().min(1, { message: 'From Name is required' }),
// 		fromEmail: z.string().email({ message: 'Invalid email address' }),
// 		smtp: smtpConfigSchema.optional(),
// 		ses: sesConfigSchema.optional(),
// 	})
// 	.refine(
// 		(data) => {
// 			if (data.provider === 'smtp') {
// 				return !!data.smtp;
// 			}
// 			if (data.provider === 'ses') {
// 				return !!data.ses;
// 			}
// 			return false;
// 		},
// 		{
// 			message: 'Configuration is required for the selected provider',
// 		}
// 	);

// export type EmailConfigFormValues = z.infer<typeof emailConfigSchema>;
