import React, { useState } from "react";
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

interface TestEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

const formSchema = z.object({
	sendTo: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export function TestEmailSheet({ open, onOpenChange, connection }: TestEmailSheetProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendTo: "",
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
				sendTo: values.sendTo,
				provider: connection.provider
			};

			formData.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

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

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent style={{ zIndex: 999999 }}>
				<SheetHeader>
					<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
					<SheetDescription>
						{__("Send a test email to verify your connection is working properly.", "trigger")}
					</SheetDescription>
				</SheetHeader>

				<div className="py-4">
					<div className="mb-4">
						<p className="text-sm font-medium mb-1">{__("Provider", "trigger")}</p>
						<Input className="text-sm" value={connection.provider} disabled />
					</div>

					<div className="mb-4">
						<p className="text-sm font-medium mb-1">{__("From", "trigger")}</p>
						<Input className="text-sm" value={connection.fromEmail} disabled />
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSendTestEmail)} className="space-y-4">
						<FormField
							control={form.control}
							name="sendTo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{__("Send To", "trigger")}</FormLabel>
									<FormControl>
										<Input placeholder="example@example.com" {...field} />
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
			</SheetContent>
		</Sheet>
	);
} 