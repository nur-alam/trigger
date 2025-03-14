import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import config from "@/config";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { smtpSchema, SmtpSettingsFormValues } from "@/utils/validationSchema";
import ErrorToast from "@/components/ErrorToast";


interface SmtpSettingsResponse {
	status_code: number;
	message?: string;
	data?: {
		smtp_host?: string;
		smtp_port?: string;
		smtp_security?: string;
		smtp_username?: string;
		smtp_password?: string;
		from_name?: string;
		from_email?: string;
		errors?: Record<string, string[]>;
	};
}

const SmtpSettingsForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isTestingEmail, setIsTestingEmail] = useState(false);
	const [toEmail, setToEmail] = useState('nuralam862@gmail.com');
	const [open, setOpen] = useState(false);

	const form = useForm<SmtpSettingsFormValues>({
		resolver: zodResolver(smtpSchema),
		defaultValues: {
			smtpHost: '',
			smtpPort: '',
			smtpSecurity: 'ssl',
			smtpUsername: '',
			smtpPassword: '',
			fromName: '',
			fromEmail: '',
		},
	});

	useEffect(() => {
		// Load existing SMTP settings
		const loadSettings = async () => {
			try {
				const formData = new FormData();
				formData.append('action', 'trigger_fetch_smtp_config');
				formData.append('trigger_nonce', config.nonce_value);

				const response = await fetch(config.ajax_url, {
					method: 'POST',
					body: formData,
				});

				const data = await response.json() as SmtpSettingsResponse;
				if (data.status_code === 200 && data.data) {
					form.reset({
						smtpHost: data.data.smtp_host || '',
						smtpPort: data.data.smtp_port || '',
						smtpSecurity: data.data.smtp_security || 'ssl',
						smtpUsername: data.data.smtp_username || '',
						smtpPassword: data.data.smtp_password || '',
						fromName: data.data.from_name || '',
						fromEmail: data.data.from_email || '',
					});
				}
			} catch (error) {
				console.error('Error loading SMTP settings:', error);
				toast.error('Failed to load SMTP settings');
			}
		};

		loadSettings();
	}, [form]);

	const onSubmit = async (values: SmtpSettingsFormValues) => {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('action', 'update_smtp_config');
			formData.append('trigger_nonce', config.nonce_value);

			// Append form values
			Object.entries(values).forEach(([key, value]) => {
				formData.append(key, value.toString());
			});

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as SmtpSettingsResponse;

			if (responseData.status_code === 200) {
				toast.success(__('SMTP configuration saved successfully!', 'trigger'));
			} else {
				if (responseData.data?.errors) {
					const errors = responseData.data.errors;
					toast((t) => <ErrorToast errors={errors} />, {});
				} else {
					toast.error(responseData.message || __('Failed to save SMTP configuration', 'trigger'));
				}
			}
		} catch (error) {
			toast.error(__('Failed to save SMTP configuration', 'trigger'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleTestEmail = async () => {
		if (!toEmail) {
			toast.error(__('Please enter a test email address', 'trigger'));
			return;
		}

		setIsTestingEmail(true);
		try {
			const formData = new FormData();
			formData.append('action', 'trigger_send_test_email');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('to_email', toEmail);

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as SmtpSettingsResponse;
			if (responseData.status_code === 200) {
				toast.success(__('Test email sent successfully!', 'trigger'));
				setOpen(false);
			} else {
				if (responseData.data?.errors) {
					const errors = responseData.data.errors;
					toast((t) => <ErrorToast errors={errors} />, {});
				} else {
					toast.error(responseData?.message || __('Failed to send test email', 'trigger'));
				}
			}
		} catch (error) {
			toast.error(__('Failed to send test email', 'trigger'));
		} finally {
			setIsTestingEmail(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-[800px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-xl font-semibold">{__("SMTP SETTINGS", "trigger")}</h2>
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button variant="outline">{__("Send Test Email", "trigger")}</Button>
							</SheetTrigger>
							<SheetContent className="z-[99999]">
								<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
								<SheetDescription>
									{__("Send a test email to verify your SMTP configuration.", "trigger")}
								</SheetDescription>
								<div className="mt-6 space-y-4">
									<div className="space-y-2">
										<Label>{__("From Email", "trigger")}</Label>
										<Input
											value={form.watch('fromEmail')}
											className="border-black-900 text-black-900 opacity-100 disabled:opacity-100 disabled:cursor-not-allowed"
											disabled
										/>
									</div>
									<div className="space-y-2">
										<Label>{__("To Email", "trigger")}</Label>
										<Input
											placeholder="Enter recipient email"
											className="border-gray-500"
											autoFocus
											value={toEmail}
											onChange={(e) => setToEmail(e.target.value)}
										/>
									</div>
									<div className="flex justify-end">
										<Button variant="default" onClick={handleTestEmail} disabled={isTestingEmail || !toEmail}>
											{isTestingEmail ? "Sending..." : "Send Test Email"}
										</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="smtpHost"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Host", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="smtp.hostinger.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="smtpPort"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Port", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="587" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="smtpSecurity"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Security", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="TLS" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="smtpUsername"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Username", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger@triggerthread.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="smtpPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Password", "trigger")}</FormLabel>
										<FormControl>
											<Input type="password" placeholder="**********" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fromName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("From Name", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fromEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("From Email", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger@triggerthread.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-between space-x-4">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="!mt-10"
									size="sm"
								>
									{isSubmitting ? 'Saving...' : 'Save Settings'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}

export default SmtpSettingsForm;