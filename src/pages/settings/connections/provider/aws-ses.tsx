import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import config from "@/config";
import toast from "react-hot-toast";
import { useState } from "react";
import { emailConfigSchema, EmailConfigFormValues } from "@/utils/validationSchema";
import { useNavigate } from "react-router-dom";
export type EmailProvider = "ses" | "smtp";

const AwsSesForm = ({ provider }: { provider: EmailProvider }) => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<EmailConfigFormValues>({
		resolver: zodResolver(emailConfigSchema),
		defaultValues: {
			provider: 'ses',
			fromName: '',
			fromEmail: '',
			ses: {
				accessKeyId: '',
				secretAccessKey: '',
				region: 'us-east-1',
			},
		},
	});

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

			const data = await response.json();

			if (data.status_code === 200) {
				toast.success(__('Email configuration saved successfully!', 'trigger'));
				navigate('/connections');
			} else {
				toast.error(data.message || __('Failed to save email configuration', 'trigger'));
			}
		} catch (error) {
			toast.error(__('Failed to save email configuration', 'trigger'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-semibold">
							{/* {provider === "ses" ? __("Amazon SES Configuration", "trigger") : __("SMTP Configuration", "trigger")} */}
							{provider} {__("Configuration", "trigger")}
						</h2>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid gap-6">
								{/* AWS SES Specific Fields */}
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

								{/* General Settings */}
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
							</div>

							<div className="flex gap-2 justify-end">
								<Button variant="outline" onClick={() => navigate('/connections')}>
									{__("Back", "trigger")}
								</Button>
								<Button type="submit" disabled={isSubmitting}>
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

export default AwsSesForm;