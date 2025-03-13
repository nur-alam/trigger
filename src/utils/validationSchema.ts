import { z } from 'zod';

// Define the validation schema
export const smtpSchema = z.object({
	smtpHost: z.string().min(1, { message: 'SMTP Host is required' }),
	smtpPort: z.string().min(1, { message: 'SMTP Port is required' }),
	smtpSecurity: z.string().min(1, { message: 'SMTP Security is required' }),
	smtpUsername: z.string().min(1, { message: 'SMTP Username is required' }),
	smtpPassword: z.string().min(1, { message: 'SMTP Password is required' }),
	fromName: z.string().min(1, { message: 'From Name is required' }),
	fromEmail: z.string().email({ message: 'Invalid email address' }),
});

export type SmtpSettingsFormValues = z.infer<typeof smtpSchema>;
