import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { EmailProviderOptionsType } from "@/utils/trigger-declaration";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GmailConfigFormValues, gmailConfigSchema } from "@/utils/schemaValidation";
import { useState } from "react";
import toast from "react-hot-toast";
import config from "@/config";
import { ResponseType } from "@/utils/trigger-declaration";
import { AnyObject, fetchUtil, triggerKeyValue } from "@/utils/utils";
import { triggerFormData } from "@/utils/utils";
import { useUpdateProvider } from "@/services/gmail-services";


const GmailForm = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const gmailForm = useForm<GmailConfigFormValues>({
		resolver: zodResolver(gmailConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			clientId: "",
			clientSecret: "",
			fromName: "",
			fromEmail: "",
		},
	});

	const updateProviderMutation = useUpdateProvider();

	const onSubmit = async (values: GmailConfigFormValues) => {
		const newValues = { ...values, provider: selectedProvider };
		const { status_code }: ResponseType = await updateProviderMutation.mutateAsync(newValues);
		if (status_code === 200) {
			toast.success(__("Email configuration saved successfully!", "trigger"));
			// navigate("/connections");
		} else {
			toast.error(__('Failed to save email configuration', 'trigger'));
		}
	}

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-semibold">
							{__("Google Gmail Configuration", "trigger")}
						</h2>
					</div>
					<Form {...gmailForm}>
						<form
							onSubmit={
								gmailForm.handleSubmit((values) => {
									onSubmit(values);
								}, (errors) => {
									console.log('Form validation failed:', errors);
								})
							}
							className="space-y-6">
							<div className="grid gap-6">
								<div className="grid gap-4">
									<FormField
										control={gmailForm.control}
										name="clientId"
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
										control={gmailForm.control}
										name="clientSecret"
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

								</div>

								{/* General Settings */}
								<div className="space-y-4 border-t pt-6">
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={gmailForm.control}
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
											control={gmailForm.control}
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
								<Button type="submit" disabled={updateProviderMutation.isPending}>
									{updateProviderMutation.isPending ? __("Saving...", "trigger") : __("Save Changes", "trigger")}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default GmailForm;