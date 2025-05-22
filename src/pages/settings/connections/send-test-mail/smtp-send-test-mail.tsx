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
import { useSendTestEmail } from "@/services/connection-services";


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

export function SmtpSendTestMail({ open, onOpenChange, connection }: TestEmailSheetProps) {

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendTo: "",
			fromEmail: connection.fromEmail,
		},
	});

	const { mutateAsync: sendTestMailMutation, isPending } = useSendTestEmail();

	const handleSendTestEmail = async (values: FormValues) => {
		const payload = {
			provider: connection.provider,
			sendTo: values.sendTo,
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
						<Input
							className="text-sm [&:disabled]:opacity-100"
							value={connection.provider}
							disabled
						/>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSendTestEmail)} className="space-y-4">
						<div className="mb-4">
							<p className="text-sm font-medium mb-1">{__("From", "trigger")}</p>
							<Input
								className="text-sm [&:disabled]:opacity-100"
								value={connection.fromEmail}
								disabled
							/>
						</div>
						<FormField
							control={form.control}
							name="sendTo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{__("Send To", "trigger")}</FormLabel>
									<FormControl>
										<Input
											placeholder="example@example.com"
											{...field}
											autoFocus
										/>
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