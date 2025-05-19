import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import config from "@/config";
import toast from "react-hot-toast";
import { SmtpConfigFormValues, smtpConfigSchema } from "@/utils/schemaValidation";
import { emailProviderAssociatedOptions, smtpSecurityAssociatedOptions, smtpSecurityOptions } from "@/utils/trigger-declaration";
import { EmailProviderOptionsType, TriggerResponseType, SmtpSecurityOptionsType } from "@/utils/trigger-declaration";
import { ConnectionType } from "..";
import { Loader2 } from "lucide-react";
import { useUpdateProvider } from "@/services/connection-services";


const DefaultSmtp = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [connectionIsLoading, setConnectionIsLoading] = useState(true);

	const form = useForm<SmtpConfigFormValues>({
		resolver: zodResolver(smtpConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			fromName: '',
			fromEmail: '',
			smtpHost: '',
			smtpPort: '587',
			smtpSecurity: 'tls',
			smtpUsername: '',
			smtpPassword: '',
		},
	});

	const updateProviderMutation = useUpdateProvider();

	const onSubmit = async (values: SmtpConfigFormValues) => {
		const newValues = { ...values, provider: selectedProvider };
		await updateProviderMutation.mutateAsync(newValues);
	}

	const fetchConnections = async () => {
		try {
			const formData = new FormData();
			formData.append('action', 'get_email_connections');
			formData.append('trigger_nonce', config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});
			const responseData = await response.json() as TriggerResponseType;
			const connections = responseData.data || [];
			setConnections(connections);

			if (connections.length > 0) {
				// Find and set the connection data immediately
				const connection = connections.find((conn: ConnectionType) => {
					return conn.provider === 'smtp';
				});

				if (connection) {
					form.setValue('fromName', connection.fromName);
					form.setValue('fromEmail', connection.fromEmail);
					form.setValue('smtpHost', connection.smtpHost || '');
					form.setValue('smtpPort', connection.smtpPort || '');
					form.setValue('smtpSecurity', connection.smtpSecurity || '');
					form.setValue('smtpUsername', connection.smtpUsername || '');
					form.setValue('smtpPassword', connection.smtpPassword || '');
				}
			}
		} catch (error) {
			console.error('Error fetching connections:', error);
		} finally {
			setConnectionIsLoading(false);
		}
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-semibold">
							{emailProviderAssociatedOptions.find(option => option.value === selectedProvider)?.label} {__("Configuration", "trigger")}
						</h2>
					</div>
					{connectionIsLoading ? (
						<div className="flex justify-center items-center h-[500px]">
							<Loader2 className="w-4 h-4 animate-spin" />
						</div>
					) : (
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
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select security type" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{smtpSecurityAssociatedOptions.map((option) => (
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
										disabled={updateProviderMutation.isPending}
									>
										{updateProviderMutation.isPending ? __("Saving...", "trigger") : __("Save Changes", "trigger")}
									</Button>
								</div>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default DefaultSmtp;