import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import config from "@/config";
import toast from "react-hot-toast";
import { SmtpConfigFormValues, smtpConfigSchema } from "@/utils/validationSchema";
import ErrorToast from "@/components/ErrorToast";
import { useNavigate } from "react-router-dom";
import { EmailProvider, emailProvider, smtpSecurityOptions } from "../add-connection";

export interface EmailSettingsResponse {
	status_code: number;
	message?: string;
	data?: {
		provider?: string;
		from_name?: string;
		from_email?: string;
		smtp_host?: string;
		smtp_port?: string;
		smtp_security?: string;
		smtp_username?: string;
		smtp_password?: string;
	};
	errors?: Record<string, string[]>;
};


const DefaultSmtp = ({ selectedProvider }: { selectedProvider: EmailProvider }) => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isTestingEmail, setIsTestingEmail] = useState(false);
	const [toEmail, setToEmail] = useState('');
	const [open, setOpen] = useState(false);

	const form = useForm<SmtpConfigFormValues>({
		resolver: zodResolver(smtpConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			fromName: '',
			fromEmail: '',
			smtpHost: '',
			smtpPort: '',
			smtpSecurity: 'tls',
			smtpUsername: '',
			smtpPassword: '',
		},
	});

	const onSubmit = async (values: SmtpConfigFormValues) => {
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

			console.log('Raw response:', response);
			const responseData = await response.json();
			console.log('Response data:', responseData);

			// Check for proper JSON response with status code
			if (responseData && responseData?.status_code === 200) {
				toast.success(responseData?.message || __('Email configuration saved successfully!', 'trigger'));
			} else {
				if (responseData?.data?.errors) {
					const errors = responseData.data.errors;
					toast((t) => <ErrorToast errors={errors} />, {});
				} else {
					toast.error(responseData?.message || __('Failed to save email configuration', 'trigger'));
				}
			}
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error(__('Failed to save email configuration', 'trigger'));
		} finally {
			setIsSubmitting(false);
		}
	};

	// Debug form state
	// useEffect(() => {
	// 	const subscription = form.watch((value) => {
	// 		console.log('Form values changed:', value);
	// 	});
	// 	return () => subscription.unsubscribe();
	// }, [form]);

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-semibold">
							{emailProvider[selectedProvider]} {__("Configuration", "trigger")}
						</h2>
					</div>

					<Form {...form}>
						<form
							onSubmit={
								form.handleSubmit((values) => {
									onSubmit(values);
								}, (errors) => {
									console.log('Form validation failed:', errors);
								})
							}
							className="space-y-6"
						>
							<div className="grid gap-4">
								<FormField
									control={form.control}
									name="smtpHost"
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
										name="smtpPort"
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
										name="smtpSecurity"
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
														{smtpSecurityOptions.map((option) => (
															<SelectItem key={option.value} value={option.value}>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="smtpUsername"
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
									name="smtpPassword"
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

							<div className="space-y-4 border-t pt-6">
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

							<div className="flex gap-2 justify-end">
								<Button
									type="submit"
									disabled={isSubmitting}
								>
									{isSubmitting ? __("Saving...", "trigger") : __("Save Changes", "trigger")}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default DefaultSmtp;