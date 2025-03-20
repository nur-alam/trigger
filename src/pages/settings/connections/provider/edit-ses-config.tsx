import { useEffect, useState } from "react";
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
	FormDescription,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import config from "@/config";
import { ConnectionType } from "@/pages/settings/connections/index";
import { SesConfigFormValues, sesConfigSchema } from "@/utils/schemaValidation";
import { AwsSesRegionAssociatedOptions, ResponseType } from "@/utils/trigger-declaration";

const EditSesConfig = ({ connection }: { connection: ConnectionType }) => {
	const form = useForm<SesConfigFormValues>({
		resolver: zodResolver(sesConfigSchema),
		defaultValues: {
			provider: connection.provider,
			fromName: connection.fromName || "",
			fromEmail: connection.fromEmail || "",
			accessKeyId: connection.accessKeyId || "",
			secretAccessKey: connection.secretAccessKey || "",
			region: connection.region || "",
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
				accessKeyId: connection.accessKeyId || "",
				secretAccessKey: connection.secretAccessKey || "",
				region: connection.region || "",
			});
		}
	}, [connection, form]);

	const onSubmit = async (values: SesConfigFormValues) => {
		try {
			const data = {
				provider: values.provider,
				fromName: values.fromName,
				fromEmail: values.fromEmail,
				accessKeyId: values.accessKeyId,
				secretAccessKey: values.secretAccessKey,
				region: values.region,
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

			if (responseData.status_code === 200) {
				toast.success(__("Connection updated successfully!", "trigger"));
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
								<Input placeholder="Sender Name" {...field} />
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
					name="accessKeyId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__("Access Key ID", "trigger")}</FormLabel>
							<FormControl>
								<Input placeholder="AKIAXXXXXXXXXXXXXXXX" {...field} />
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
								<Input type="password" placeholder="••••••••••••••••••••••••••••••••" {...field} />
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
										<SelectValue placeholder={__("Select region", "trigger")} />
									</SelectTrigger>
								</FormControl>
								<SelectContent style={{ zIndex: 999999 }}>
									{AwsSesRegionAssociatedOptions.map((region) => (
										<SelectItem key={region.value} value={region.value}>
											{__(region.label, "trigger")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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

export default EditSesConfig;