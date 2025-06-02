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
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
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
import { useGetSesVerifiedEmails, useSendTestEmail } from "@/services/connection-services";

interface TestEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

const formSchema = z.object({
	fromEmail: z.string().email({
		message: "Need a valid email address.",
	}),
	to: z.string().email({
		message: "Need a valid email address.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export function AwsSendTestMail({ open, onOpenChange, connection }: TestEmailSheetProps) {
	const [verifiedEmails, setVerifiedEmails] = useState<AwsSesVerifiedEmailType[]>([]);

	// Load verified emails when the sheet opens
	const { data: sesVerifiedEmails, isLoading: sesVerifiedEmailsLoading, isError } = useGetSesVerifiedEmails();

	useEffect(() => {
		if (open) {
			setVerifiedEmails(sesVerifiedEmails?.data || []);
		}
	}, [open, sesVerifiedEmails]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			to: "",
			fromEmail: connection.fromEmail,
		},
	});

	// Update form value when verified emails are loaded
	useEffect(() => {
		if (verifiedEmails.length > 0) {
			const defaultEmail = verifiedEmails.find(email => email.email === connection.fromEmail)?.email || verifiedEmails[0].email;
			form.setValue("fromEmail", defaultEmail);
		}
	}, [verifiedEmails]);

	const { mutateAsync: sendTestMailMutation, isPending } = useSendTestEmail();

	const handleSendTestEmail = async (values: FormValues) => {
		const payload = {
			provider: connection.provider,
			to: values.to,
			fromEmail: values.fromEmail || connection.fromEmail
		};
		await sendTestMailMutation(payload);
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
						{sesVerifiedEmailsLoading ? (
							<div className="flex justify-left items-center h-[40px]">
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								{__("Loading...", "trigger")}
							</div>
						) : (
							<FormField
								control={form.control}
								name="fromEmail"
								render={({ field }) => (
									<FormItem>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder={__("Select verified email", "trigger")} />
											</SelectTrigger>
											<SelectContent style={{ zIndex: 999999 }}>
												{verifiedEmails.map((email) => (
													<SelectItem key={email.email} value={email.email}>
														{email.email}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name="to"
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
							<Button type="submit" disabled={isPending}>
								{isPending ? (
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