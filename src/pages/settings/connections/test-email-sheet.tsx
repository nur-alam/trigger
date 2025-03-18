import React, { useState } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import config from "@/config";

interface TestEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: {
		provider: string;
		from_email: string;
	};
}

export function TestEmailSheet({ open, onOpenChange, connection }: TestEmailSheetProps) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSendTestEmail = async () => {
		if (!email) {
			toast.error(__("Please enter an email address to send the test email to.", "trigger"));
			return;
		}

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("action", "trigger_send_test_email");
			formData.append("trigger_nonce", config.nonce_value);
			formData.append("to_email", email);

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (data.code === 200) {
				toast.success(__("Test email sent successfully!", "trigger"));
				onOpenChange(false);
			} else {
				toast.error(data.message || __("Failed to send test email. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
			console.error("Error sending test email:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
					<SheetDescription>
						{__("Send a test email to verify your connection is working properly.", "trigger")}
					</SheetDescription>
				</SheetHeader>

				<div className="grid gap-4 py-6">
					<div className="space-y-2">
						<Label htmlFor="provider">{__("Provider", "trigger")}</Label>
						<Input id="provider" value={connection.provider} disabled />
					</div>
					<div className="space-y-2">
						<Label htmlFor="from">{__("From", "trigger")}</Label>
						<Input id="from" value={connection.from_email} disabled />
					</div>
					<div className="space-y-2">
						<Label htmlFor="to" className="text-right">
							{__("Send To", "trigger")}
						</Label>
						<Input
							id="to"
							placeholder="example@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>

				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">{__("Cancel", "trigger")}</Button>
					</SheetClose>
					<Button onClick={handleSendTestEmail} disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{__("Sending...", "trigger")}
							</>
						) : (
							__("Send Test Email", "trigger")
						)}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
} 