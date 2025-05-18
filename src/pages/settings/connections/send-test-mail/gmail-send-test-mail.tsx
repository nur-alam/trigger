import React, { useState, useEffect } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import config from "@/config";
import { ConnectionType } from "@/pages/settings/connections/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AwsSesVerifiedEmailType } from "@/utils/trigger-declaration";
import { ResponseType } from "@/utils/trigger-declaration";
import { useSearchParams } from "react-router-dom";

interface TestEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

const formSchema = z.object({
	fromEmail: z.string().email({
		message: "Need a valid email address.",
	}),
	sendTo: z.string().email({
		message: "Need a valid email address.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export function GmailSendTestMail({ open, onOpenChange, connection }: TestEmailSheetProps) {
	const [isLoading, setIsLoading] = useState(false);
	const redirectUrl = `${config.site_url}/wp-admin/admin.php?page=trigger`;
	const [authUrl, setAuthUrl] = useState('');
	const [isGmailConnected, setIsGmailConnected] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendTo: "",
			fromEmail: connection.fromEmail,
		},
	});

	const handleSendTestEmail = async (values: FormValues) => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("action", "trigger_send_test_email");
			formData.append("trigger_nonce", config.nonce_value);

			// Include both sendTo email and provider in the data
			const data = {
				provider: connection.provider,
				sendTo: values.sendTo,
				fromEmail: values.fromEmail || connection.fromEmail
			};

			formData.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const result = await response.json() as ResponseType;

			if (result.status_code === 200) {
				toast.success(result.message || __("Test email sent successfully!", "trigger"));
				onOpenChange(false); // Close the sheet after success
			} else {
				toast.error(result.message || __("Failed to send test email. Please try again.", "trigger"));
			}
		} catch (error) {
			console.error("Error sending test email:", error);
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
		} finally {
			setIsLoading(false);
		}
	};

	const connectWithGmail = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("action", "trigger_connect_with_gmail");
			formData.append("trigger_nonce", config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});
			const result = await response.json() as ResponseType;

			if (result.status_code === 200) {
				window.location.href = result.data.auth_url;
				// toast.success(result.message || __("Connected with Gmail successfully!", "trigger"));
			} else {
				toast.error(result.message || __("Failed to connect with Gmail. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
		} finally {
			// setIsLoading(false);
		}
	}

	// Update form value when verified emails are loaded
	useEffect(() => {
		if (open) {
			gmailConnectedOrNot();
		}
	}, [open]);

	const gmailConnectedOrNot = async () => {
		try {
			const formData = new FormData();
			formData.append("action", "trigger_is_gmail_connected");
			formData.append("trigger_nonce", config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});
			const result = await response.json();

			if (result.status_code === 200) {
				setIsGmailConnected(true);
				// setAuthUrl(result.data.auth_url);
				// toast.success(result.message || __("Connected with Gmail successfully!", "trigger"));
			} else {
				setIsGmailConnected(false);
				// toast.error(result.message || __("Failed to connect with Gmail. check your credentials.", "trigger"));
			}
		} catch (error) {
			// toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
		} finally {
			// setIsLoading(false);
		}
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent style={{ zIndex: 999999, maxWidth: '550px' }}>
				{!isGmailConnected ?
					<>
						<SheetHeader className="mt-10">
							<SheetTitle>{__("Set this redirect uri into your google console", "trigger")}</SheetTitle>
							{/* <SheetDescription>
								{__("Send a test email to verify your connection is working properly.", "trigger")}
							</SheetDescription> */}
						</SheetHeader>
						<div className="mt-4">
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
							<Button
								variant="default"
								size="icon"
								onClick={(e: React.MouseEvent) => connectWithGmail(e)}
								className="w-full"
							>
								{__('Connect With Gmail', 'trigger')}
							</Button>
						</div>
					</>
					:
					<>
						<SheetHeader>
							<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
							<SheetDescription>
								{__("Send a test email to verify your connection is working properly.", "trigger")}
							</SheetDescription>
						</SheetHeader>

						<div className="pt-4">
							<div className="mb-4">
								<p className="text-sm font-medium mb-1">{__("Provider", "trigger")}</p>
								<Input className="text-sm [&:disabled]:opacity-100" value={connection.provider} disabled />
							</div>
						</div>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSendTestEmail)} className="space-y-4">
								<div className="mb-4">
									<p className="text-sm font-medium mb-1">{__("From", "trigger")}</p>
								</div>
								<FormField
									control={form.control}
									name="fromEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__("From Email", "trigger")}</FormLabel>
											<FormControl>
												<Input placeholder="example@example.com" {...field} autoFocus />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="sendTo"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__("Send To", "trigger")}</FormLabel>
											<FormControl>
												<Input placeholder="example@example.com" {...field} autoFocus />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-end gap-2 mt-6">
									<SheetClose asChild>
										<Button variant="outline">{__("Cancel", "trigger")}</Button>
									</SheetClose>
									<Button type="submit" disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{__("Sending...", "trigger")}
											</>
										) : (
											__("Send Test Email", "trigger")
										)}
									</Button>
								</div>
							</form>
						</Form>
					</>
				}
			</SheetContent>
		</Sheet>
	);
} 