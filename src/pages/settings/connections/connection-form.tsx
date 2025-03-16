import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import config from "@/config";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { emailConfigSchema, EmailConfigFormValues } from "@/utils/validationSchema";
import ErrorToast from "@/components/ErrorToast";

interface EmailSettingsResponse {
	status_code: number;
	message?: string;
	data?: {
		provider?: string;
		smtp?: {
			smtp_host?: string;
			smtp_port?: string;
			smtp_security?: string;
			smtp_username?: string;
			smtp_password?: string;
		};
		ses?: {
			access_key_id?: string;
			secret_access_key?: string;
			region?: string;
		};
		from_name?: string;
		from_email?: string;
		errors?: Record<string, string[]>;
	};
}

const ConnectionForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isTestingEmail, setIsTestingEmail] = useState(false);
	const [toEmail, setToEmail] = useState('');
	const [open, setOpen] = useState(false);

	const form = useForm<EmailConfigFormValues>({
		resolver: zodResolver(emailConfigSchema),
		defaultValues: {
			provider: 'smtp',
			fromName: '',
			fromEmail: '',
			smtp: {
				smtpHost: '',
				smtpPort: '',
				smtpSecurity: 'ssl',
				smtpUsername: '',
				smtpPassword: '',
			},
			ses: {
				accessKeyId: '',
				secretAccessKey: '',
				region: 'us-east-1',
			},
		},
	});

	const provider = form.watch('provider');

	useEffect(() => {
		// Load existing email settings
		const loadSettings = async () => {
			try {
				const formData = new FormData();
				formData.append('action', 'trigger_fetch_email_config');
				formData.append('trigger_nonce', config.nonce_value);

				const response = await fetch(config.ajax_url, {
					method: 'POST',
					body: formData,
				});

				const data = await response.json() as EmailSettingsResponse;
				if (data.status_code === 200 && data.data) {
					form.reset({
						provider: data.data.provider as 'smtp' | 'ses' || 'smtp',
						fromName: data.data.from_name || '',
						fromEmail: data.data.from_email || '',
						smtp: data.data.smtp ? {
							smtpHost: data.data.smtp.smtp_host || '',
							smtpPort: data.data.smtp.smtp_port || '',
							smtpSecurity: data.data.smtp.smtp_security || 'ssl',
							smtpUsername: data.data.smtp.smtp_username || '',
							smtpPassword: data.data.smtp.smtp_password || '',
						} : undefined,
						ses: data.data.ses ? {
							accessKeyId: data.data.ses.access_key_id || '',
							secretAccessKey: data.data.ses.secret_access_key || '',
							region: data.data.ses.region || 'us-east-1',
						} : undefined,
					});
				}
			} catch (error) {
				console.error('Error loading email settings:', error);
				toast.error('Failed to load email settings');
			}
		};

		loadSettings();
	}, [form]);

	const onSubmit = async (values: EmailConfigFormValues) => {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('action', 'update_email_config');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('data', JSON.stringify(values));

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as EmailSettingsResponse;

			if (responseData.status_code === 200) {
				toast.success(__('Email configuration saved successfully!', 'trigger'));
			} else {
				if (responseData.data?.errors) {
					const errors = responseData.data.errors;
					toast((t) => <ErrorToast errors={errors} />, {});
				} else {
					toast.error(responseData.message || __('Failed to save email configuration', 'trigger'));
				}
			}
		} catch (error) {
			toast.error(__('Failed to save email configuration', 'trigger'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleTestEmail = async () => {
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

			const data = await response.json() as EmailSettingsResponse;

			if (data.status_code === 200) {
				toast.success(__('Test email sent successfully!', 'trigger'));
				setOpen(false);
			} else {
				toast.error(data.message || __('Failed to send test email', 'trigger'));
			}
		} catch (error) {
			toast.error(__('Failed to send test email', 'trigger'));
		} finally {
			setIsTestingEmail(false);
		}
	};

	return (
		<div className="flex justify-center mt-5 p-5">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-xl font-semibold">{__("Email Settings", "trigger")}</h2>
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button variant="outline">{__("Send Test Email", "trigger")}</Button>
							</SheetTrigger>
							<SheetContent className="z-[99999]">
								<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
								<SheetDescription>
									{__("Send a test email to verify your email configuration.", "trigger")}
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
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Tabs
								defaultValue="smtp"
								className="flex gap-6"
								onValueChange={(value: string) => form.setValue('provider', value as 'smtp' | 'ses')}
							>
								<TabsList className="flex flex-col h-fit w-48 bg-muted p-2 rounded-lg">
									<TabsTrigger value="smtp" className="w-full justify-start gap-2 p-2.5">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<rect width="20" height="16" x="2" y="4" rx="2" />
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
										</svg>
										SMTP
									</TabsTrigger>
									<TabsTrigger value="ses" className="w-full justify-start gap-2 p-2.5">
										<img
											src="/wp-content/plugins/trigger/assets/images/aws-logo.png"
											alt="AWS"
											className="h-5 w-5"
										/>
										Amazon SES
									</TabsTrigger>
								</TabsList>

								<div className="flex-1 border-l pl-6">
									<TabsContent value="smtp">
										<div className="grid gap-4">
											<FormField
												control={form.control}
												name="smtp.smtpHost"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("SMTP Host", "trigger")}</FormLabel>
														<FormControl>
															<Input placeholder="smtp.hostinger.com" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className="grid grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name="smtp.smtpPort"
													render={({ field }) => (
														<FormItem>
															<FormLabel>{__("SMTP Port", "trigger")}</FormLabel>
															<FormControl>
																<Input placeholder="587" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="smtp.smtpSecurity"
													render={({ field }) => (
														<FormItem>
															<FormLabel>{__("SMTP Security", "trigger")}</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select security type" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="ssl">SSL</SelectItem>
																	<SelectItem value="tls">TLS</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<FormField
												control={form.control}
												name="smtp.smtpUsername"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("SMTP Username", "trigger")}</FormLabel>
														<FormControl>
															<Input placeholder="username@example.com" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="smtp.smtpPassword"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("SMTP Password", "trigger")}</FormLabel>
														<FormControl>
															<Input type="password" placeholder="••••••••" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</TabsContent>

									<TabsContent value="ses">
										<div className="grid gap-4">
											<FormField
												control={form.control}
												name="ses.accessKeyId"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("Access Key ID", "trigger")}</FormLabel>
														<FormControl>
															<Input placeholder="AKIA..." {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="ses.secretAccessKey"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("Secret Access Key", "trigger")}</FormLabel>
														<FormControl>
															<Input type="password" placeholder="••••••••" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="ses.region"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("Region", "trigger")}</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select AWS region" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
																<SelectItem value="us-east-2">US East (Ohio)</SelectItem>
																<SelectItem value="us-west-1">US West (N. California)</SelectItem>
																<SelectItem value="us-west-2">US West (Oregon)</SelectItem>
																<SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
																<SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
																<SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
																<SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
																<SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
																<SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</TabsContent>

									<div className="space-y-4 border-t pt-6 mt-6">
										<h3 className="text-lg font-medium">{__("General Settings", "trigger")}</h3>
										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="fromName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("From Name", "trigger")}</FormLabel>
														<FormControl>
															<Input placeholder="WordPress" {...field} />
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
														<FormLabel>{__("From Email", "trigger")}</FormLabel>
														<FormControl>
															<Input placeholder="wordpress@example.com" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									<div className="flex justify-end mt-6">
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? __("Saving...", "trigger") : __("Save Changes", "trigger")}
										</Button>
									</div>
								</div>
							</Tabs>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConnectionForm;