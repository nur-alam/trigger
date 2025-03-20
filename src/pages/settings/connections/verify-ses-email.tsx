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
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
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
	FormDescription,
} from "@/components/ui/form";
import { z } from "zod";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerifySesEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

const verifyEmailFormSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailFormSchema>;

type VerifiedEmail = {
	email: string;
	status: string;
};

export function VerifySesEmailSheet({ open, onOpenChange, connection }: VerifySesEmailSheetProps) {
	const [isVerifying, setIsVerifying] = useState(false);
	const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);
	const [isLoadingEmails, setIsLoadingEmails] = useState(false);

	const form = useForm<VerifyEmailFormValues>({
		resolver: zodResolver(verifyEmailFormSchema),
		defaultValues: {
			email: "",
		},
	});

	// Load verified emails when the sheet opens
	useEffect(() => {
		if (open) {
			loadVerifiedEmails();
		}
	}, [open]);

	const loadVerifiedEmails = async () => {
		setIsLoadingEmails(true);
		try {
			const formData = new FormData();
			formData.append("action", "get_verified_ses_emails");
			formData.append("trigger_nonce", config.nonce_value);

			const data = {
				provider: connection.provider
			};

			formData.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();
			if (result.status_code === 200) {
				setVerifiedEmails(result.data || []);
			} else {
				toast.error(result.message || __("Failed to load verified emails.", "trigger"));
			}
		} catch (error) {
			console.error("Error loading verified emails:", error);
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
		} finally {
			setIsLoadingEmails(false);
		}
	};

	const handleVerifyEmail = async (values: VerifyEmailFormValues) => {
		setIsVerifying(true);
		try {
			const formData = new FormData();
			formData.append("action", "verify_ses_email");
			formData.append("trigger_nonce", config.nonce_value);

			const data = {
				email: values.email,
				provider: connection.provider
			};

			formData.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (result.status_code === 200) {
				toast.success(result.message || __("Verification email sent successfully!", "trigger"));
				form.reset();
				// Reload the verified emails list after a short delay
				setTimeout(() => {
					loadVerifiedEmails();
				}, 2000);
			} else {
				toast.error(result.message || __("Failed to send verification email. Please try again.", "trigger"));
			}
		} catch (error) {
			console.error("Error verifying email:", error);
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
		} finally {
			setIsVerifying(false);
		}
	};

	const getStatusBadge = (status: string) => {
		if (status === "Success") {
			return (
				<Badge variant="success" className="flex items-center gap-1">
					<CheckCircle className="h-3 w-3" />
					{__("Verified", "trigger")}
				</Badge>
			);
		} else if (status === "Pending") {
			return (
				<Badge variant="outline" className="flex items-center gap-1 text-yellow-500 border-yellow-500">
					<AlertCircle className="h-3 w-3" />
					{__("Pending", "trigger")}
				</Badge>
			);
		} else {
			return (
				<Badge variant="destructive" className="flex items-center gap-1">
					<AlertCircle className="h-3 w-3" />
					{status}
				</Badge>
			);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="overflow-y-auto" style={{ zIndex: 999999 }}>
				<SheetHeader className="mb-6">
					<SheetTitle>{__("Verify AWS SES Email Address", "trigger")}</SheetTitle>
					<SheetDescription>
						{__("AWS SES requires that email addresses be verified before they can be used as a sender. Use this form to verify your email addresses.", "trigger")}
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle>{__("Add New Email Address", "trigger")}</CardTitle>
							<CardDescription>
								{__("Enter an email address that you want to send emails from", "trigger")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleVerifyEmail)} className="space-y-4">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{__("Email Address", "trigger")}</FormLabel>
												<FormControl>
													<Input placeholder="you@example.com" {...field} />
												</FormControl>
												<FormDescription>
													{__("You'll receive a verification email with a link to confirm ownership.", "trigger")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex justify-end">
										<Button type="submit" disabled={isVerifying}>
											{isVerifying ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													{__("Sending...", "trigger")}
												</>
											) : (
												__("Send Verification", "trigger")
											)}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<div>
								<CardTitle>{__("Verified Email Addresses", "trigger")}</CardTitle>
								<CardDescription>
									{__("These email addresses have been registered with AWS SES", "trigger")}
								</CardDescription>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="gap-1"
								onClick={loadVerifiedEmails}
								disabled={isLoadingEmails}
							>
								{isLoadingEmails ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<RefreshCw className="h-4 w-4" />
								)}
								{__("Refresh", "trigger")}
							</Button>
						</CardHeader>
						<CardContent>
							{isLoadingEmails ? (
								<div className="flex justify-center py-6">
									<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
								</div>
							) : verifiedEmails.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{__("Email Address", "trigger")}</TableHead>
											<TableHead className="w-[150px] text-right">{__("Status", "trigger")}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{verifiedEmails.map((item) => (
											<TableRow key={item.email}>
												<TableCell>{item.email}</TableCell>
												<TableCell className="text-right">{getStatusBadge(item.status)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="py-6 text-center text-muted-foreground">
									{__("No verified email addresses found. Use the form above to verify an email address.", "trigger")}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<div className="mt-6 flex justify-end">
					<SheetClose asChild>
						<Button variant="outline">{__("Close", "trigger")}</Button>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
} 