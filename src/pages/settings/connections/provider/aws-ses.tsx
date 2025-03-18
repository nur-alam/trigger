import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import config from "@/config";
import { useState } from "react";
import { sesConfigSchema, SesConfigFormValues } from "@/utils/validationSchema";
import { useNavigate } from "react-router-dom";
import { EmailProvider, emailProvider } from "../add-connection";
import toast from "react-hot-toast";

const awsRegions = [
	{ value: 'us-east-1', label: 'US East (N. Virginia)' },
	{ value: 'us-east-2', label: 'US East (Ohio)' },
	{ value: 'us-west-1', label: 'US West (N. California)' },
	{ value: 'us-west-2', label: 'US West (Oregon)' },
	{ value: 'eu-west-1', label: 'EU (Ireland)' },
	{ value: 'eu-central-1', label: 'EU (Frankfurt)' },
	{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
	{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
	{ value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
	{ value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
];

const AwsSesForm = ({ selectedProvider }: { selectedProvider: EmailProvider }) => {
	console.log('AwsSesForm selectedProvider', selectedProvider);
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	console.log('selectedProvider', selectedProvider);
	const form = useForm<SesConfigFormValues>({
		resolver: zodResolver(sesConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			fromName: '',
			fromEmail: '',
			accessKeyId: '',
			secretAccessKey: '',
			region: 'us-east-1',
		},
	});

	const onSubmit = async (values: SesConfigFormValues) => {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('action', 'update_email_config');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('data', JSON.stringify({
				provider: selectedProvider,
				fromName: values.fromName,
				fromEmail: values.fromEmail,
				accessKeyId: values.accessKeyId,
				secretAccessKey: values.secretAccessKey,
				region: values.region,
			}));

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
							className="space-y-6">
							<div className="grid gap-6">
								<div className="grid gap-4">
									<FormField
										control={form.control}
										name="accessKeyId"
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
										name="secretAccessKey"
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
										name="region"
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
														{awsRegions.map((region) => (
															<SelectItem
																key={region.value}
																value={region.value}
															>
																{region.label}
															</SelectItem>
														))}
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