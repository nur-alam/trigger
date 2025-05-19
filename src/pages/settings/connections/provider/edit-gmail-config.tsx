import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import config from "@/config";
import { ConnectionType } from "@/pages/settings/connections/index";
import { GmailConfigFormValues, gmailConfigSchema } from "@/utils/schemaValidation";
import { TriggerResponseType } from "@/utils/trigger-declaration";
import { useConnectGmail, useIsGmailConnected, useUpdateProvider } from "@/services/connection-services";

const EditGmailConfig = ({ connection }: { connection: ConnectionType }) => {

	const redirectUrl = `${config.site_url}/wp-admin/admin.php?page=trigger`;
	const [isGmailConnected, setIsGmailConnected] = useState(false);

	const form = useForm<GmailConfigFormValues>({
		resolver: zodResolver(gmailConfigSchema),
		defaultValues: {
			provider: connection.provider,
			fromName: connection.fromName || "",
			fromEmail: connection.fromEmail || "",
			clientId: connection.clientId || "",
			clientSecret: connection.clientSecret || "",
		},
		mode: "onChange",
	});

	// Load connection data into form
	useEffect(() => {
		if (connection) {
			form.reset({
				provider: connection.provider,
				fromName: connection.fromName || "",
				fromEmail: connection.fromEmail || "",
				clientId: connection.clientId || "",
				clientSecret: connection.clientSecret || "",
			});
		}
	}, [connection, form]);

	const updateProviderMutation = useUpdateProvider();

	const onSubmit = async (values: GmailConfigFormValues) => {
		const newValues = { ...values };
		await updateProviderMutation.mutateAsync(newValues);
	}

	const connectGmailMutation = useConnectGmail();

	const connectWithGmail = async (e: React.MouseEvent) => {
		e.preventDefault();
		await connectGmailMutation.mutateAsync();
	}

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

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
					<FormField
						control={form.control}
						name="fromName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{__("From Name", "trigger")}</FormLabel>
								<FormControl>
									<Input placeholder="Sender Name" {...field} autoFocus />
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
								<div>
									<FormControl className="flex-1">
										<Input type="email" placeholder="sender@example.com" {...field} />
									</FormControl>
								</div>
								<FormDescription>
									{__("AWS SES requires email addresses to be verified before they can be used to send emails.", "trigger")}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="clientId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{__("Client ID", "trigger")}</FormLabel>
								<FormControl>
									<Input placeholder="AKIAXXXXXXXXXXXXXXXX" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="clientSecret"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{__("Client Secret", "trigger")}</FormLabel>
								<FormControl>
									<Input type="password" placeholder="••••••••••••••••••••••••••••••••" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-2 mt-6">
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{__("Updating...", "trigger")}
								</>
							) : (
								__("Save Changes", "trigger")
							)}
						</Button>
					</div>
				</form>
			</Form>

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
						onClick={() => {
							navigator.clipboard.writeText(redirectUrl);
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
		</>
	);
};

export default EditGmailConfig;