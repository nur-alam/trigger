import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { EmailProviderOptionsType } from "@/utils/trigger-declaration";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GmailConfigFormValues, gmailConfigSchema } from "@/utils/schemaValidation";
import { useEffect, useState } from "react";
import config from "@/config";
import { TriggerResponseType } from "@/utils/trigger-declaration";
import { useGetAllProviders, useUpdateProvider } from "@/services/connection-services";
import { ConnectionType } from "..";
import { Loader2 } from "lucide-react";
import { wait } from "@/utils/utils";


const GmailForm = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
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
		await updateProviderMutation.mutateAsync(newValues);
	}

	const { data: allProviders, isLoading } = useGetAllProviders();
	useEffect(() => {
		if (allProviders) {
			if (allProviders?.data.length > 0) {
				const connection = allProviders?.data.find((conn: ConnectionType) => {
					return conn.provider === 'gmail';
				});
				if (connection) {
					gmailForm.setValue('fromName', connection.fromName);
					gmailForm.setValue('fromEmail', connection.fromEmail);
					gmailForm.setValue('clientId', connection.clientId || '');
					gmailForm.setValue('clientSecret', connection.clientSecret || '');
				}
			}
		}
	}, [allProviders]);

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-semibold">
							{__("Google Gmail Configuration", "trigger")}
						</h2>
					</div>
					{isLoading ? (
						<div className="flex justify-center items-center h-[500px]">
							<Loader2 className="w-4 h-4 animate-spin" />
						</div>
					) :
						(
							<Form {...gmailForm}>
								<form
									onSubmit={
										gmailForm.handleSubmit((values) => {
											onSubmit(values);
										}, (errors) => { })
									}
									className="space-y-6"
								>
									<div className="grid gap-6">
										<div className="grid gap-4">
											<FormField
												control={gmailForm.control}
												name="clientId"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{__("Client ID", "trigger")}</FormLabel>
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
														<FormLabel>{__("Client Secret", "trigger")}</FormLabel>
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
						)
					}
				</CardContent>
			</Card>
		</div>
	);
};

export default GmailForm;