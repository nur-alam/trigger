import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { EmailProviderOptionsType, redirectUrl, TriggerResponseType } from "@/utils/trigger-declaration";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GmailConfigFormValues, gmailConfigSchema } from "@/utils/schemaValidation";
import { useEffect, useState } from "react";
import { useConnectGmail, useGetAllProviders, useIsGmailConnected, useUpdateProvider } from "@/services/connection-services";
import { ConnectionType } from "..";
import { Loader2 } from "lucide-react";
import { copyToClipboard } from "@/utils/utils";
import toast from "react-hot-toast";


const GmailForm = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {

	const [isGmailConnected, setIsGmailConnected] = useState(false);

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

	const isGmailConnectedMutation = useIsGmailConnected();

	useEffect(() => {
		gmailConnectedOrNot();
	}, []);


	const gmailConnectedOrNot = async () => {
		const { status_code } = await isGmailConnectedMutation.mutateAsync() as TriggerResponseType;
		if (200 === status_code) {
			setIsGmailConnected(true);
		} else {
			setIsGmailConnected(false);
		}
	}

	const connectGmailMutation = useConnectGmail();

	const connectWithGmail = async (e: React.MouseEvent) => {
		e.preventDefault();
		await connectGmailMutation.mutateAsync();
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
					<hr className="mt-4" />
					<div className="mt-4">
						<h2 className="mb-2">{__('Use this URI to your google cloud console', 'trigger')}</h2>
						<div className="flex items-center gap-2 p-3 bg-muted rounded-md mb-4">
							<Input
								value={redirectUrl}
								readOnly
								className="flex-1"
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={async () => {
									await copyToClipboard(redirectUrl);
									toast.success(__('Copied to clipboard', 'trigger'));
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
							</Button>
						</div>
						{
							isGmailConnectedMutation.isPending ?
								<Loader2 className="h-4 w-4 animate-spin mx-auto" /> :
								isGmailConnected ?
									<>
										<Button
											variant="destructive"
											size="icon"
											onClick={(e: React.MouseEvent) => connectWithGmail(e)}
											className="w-full"
										>
											{connectGmailMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
											{__('Reconnect With Gmail', 'trigger')}
										</Button>
									</> :
									<>
										<Button
											variant="default"
											size="icon"
											onClick={(e: React.MouseEvent) => connectWithGmail(e)}
											className="w-full"
										>
											{connectGmailMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
											{__('Connect With Gmail', 'trigger')}
										</Button>
									</>
						}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GmailForm;