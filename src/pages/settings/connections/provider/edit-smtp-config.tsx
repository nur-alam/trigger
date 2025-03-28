import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import { ConnectionType } from "@/pages/settings/connections/index";
import { SmtpPortOptionsType, SmtpSecurityOptionsType, ResponseType } from "@/utils/trigger-declaration";
import { SmtpConfigFormValues, smtpConfigSchema } from "@/utils/schemaValidation";
import config from "@/config";


const EditSmtpConfig = ({ connection }: { connection: ConnectionType }) => {
	const form = useForm<SmtpConfigFormValues>({
		resolver: zodResolver(smtpConfigSchema),
		defaultValues: {
			provider: connection.provider || "smtp",
			fromName: connection.fromName || "",
			fromEmail: connection.fromEmail || "",
			smtpHost: connection.smtpHost || "",
			smtpPort: connection.smtpPort as SmtpPortOptionsType,
			smtpSecurity: (connection.smtpSecurity as SmtpSecurityOptionsType),
			smtpUsername: connection.smtpUsername || "",
			smtpPassword: connection.smtpPassword || "",
		},
		mode: "onChange",
	});

	// Load connection data into form
	useEffect(() => {
		if (connection) {
			form.reset({
				provider: connection.provider || "smtp",
				fromName: connection.fromName || "",
				fromEmail: connection.fromEmail || "",
				smtpHost: connection.smtpHost || "",
				smtpPort: connection.smtpPort as SmtpPortOptionsType,
				smtpSecurity: (connection.smtpSecurity as SmtpSecurityOptionsType),
				smtpUsername: connection.smtpUsername || "",
				smtpPassword: connection.smtpPassword || "",
			});
		}
	}, [connection, form]);

	const onSubmit = async (values: SmtpConfigFormValues) => {
		console.log('smtp values', values);
		try {
			const data = {
				provider: values.provider,
				fromName: values.fromName,
				fromEmail: values.fromEmail,
				smtpHost: values.smtpHost,
				smtpPort: values.smtpPort,
				smtpSecurity: values.smtpSecurity,
				smtpUsername: values.smtpUsername,
				smtpPassword: values.smtpPassword,
			};

			const formData = new FormData();
			formData.append("action", "edit_email_config");
			formData.append("trigger_nonce", config.nonce_value);
			formData.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const responseData = await response.json() as ResponseType;
			console.log('responseData', responseData);
			if (responseData.status_code === 200) {
				toast.success(__("Connection updated successfully!", "trigger"));
				window.location.reload();
			} else {
				toast.error(responseData.message || __("Failed to update connection. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
			console.error("Error updating connection:", error);
		}
	};

	return (
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
							<FormControl>
								<Input type="email" placeholder="sender@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpHost"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__("SMTP Host", "trigger")}</FormLabel>
							<FormControl>
								<Input placeholder="smtp.example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
							<FormLabel>{__("Security", "trigger")}</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={__("Select security type", "trigger")} />
									</SelectTrigger>
								</FormControl>
								<SelectContent style={{ zIndex: 999999 }}>
									<SelectItem value="none">{__("None", "trigger")}</SelectItem>
									<SelectItem value="ssl">{__("SSL", "trigger")}</SelectItem>
									<SelectItem value="tls">{__("TLS", "trigger")}</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpUsername"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__("SMTP Username", "trigger")}</FormLabel>
							<FormControl>
								<Input placeholder="username" {...field} />
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
	);
};

export default EditSmtpConfig;