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
import { sesConfigSchema, SesConfigFormValues } from "@/utils/schemaValidation";
import { useNavigate } from "react-router-dom";
import { emailProviderAssociatedOptions } from "@/utils/trigger-declaration";
import { EmailProviderOptionsType } from "@/utils/trigger-declaration";
import toast from "react-hot-toast";
import { AwsSesRegionOptionsType, AwsSesRegionAssociatedOptions } from "@/utils/trigger-declaration";

const AwsSesForm = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<SesConfigFormValues>({
		resolver: zodResolver(sesConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			fromName: '',
			fromEmail: '',
			accessKeyId: '',
			secretAccessKey: '',
			region: AwsSesRegionAssociatedOptions[0].value,
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
							{emailProviderAssociatedOptions.find(option => option.value === selectedProvider)?.label} {__("Configuration", "trigger")}
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
															<SelectValue placeholder={__("Select AWS region", "trigger")} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{AwsSesRegionAssociatedOptions.map((region) => (
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