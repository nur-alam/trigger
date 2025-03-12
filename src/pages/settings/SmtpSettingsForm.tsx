import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import config from "@/config";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Define the validation schema
const smtpSchema = z.object({
	smtpHost: z.string().min(1, "SMTP host is required"),
	smtpPort: z.string().min(1, "SMTP port is required"),
	smtpSecurity: z.string().min(1, "SMTP security is required"),
	smtpUsername: z.string().min(1, "Username is required"),
	smtpPassword: z.string().min(1, "Password is required"),
	fromName: z.string().min(1, "From name is required"),
	fromEmail: z.string().email("Invalid email address"),
});

type SmtpFormValues = z.infer<typeof smtpSchema>;

export default function SmtpSettingsForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<any>({
		// resolver: zodResolver(smtpSchema),
		defaultValues: {
			smtpHost: "",
			smtpPort: "",
			smtpSecurity: "",
			smtpUsername: "",
			smtpPassword: "",
			fromName: "",
			fromEmail: "",
		},
	});

	const onSubmit = async (data: SmtpFormValues) => {
		try {
			setIsSubmitting(true);
			const formData = new FormData();
			formData.append('action', 'update_smtp_config');
			formData.append(config.nonce_key, config.nonce_value);
			formData.append('smtpHost', data.smtpHost);
			formData.append('smtpPort', data.smtpPort);
			formData.append('smtpSecurity', data.smtpSecurity);
			formData.append('smtpUsername', data.smtpUsername);
			formData.append('smtpPassword', data.smtpPassword);
			formData.append('fromName', data.fromName);
			formData.append('fromEmail', data.fromEmail);

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData
			});

			const responseData = await response.json();
			if (responseData?.success) {
				toast.success(responseData?.message);
			} else {
				// Handle validation errors
				if (responseData?.status_code === 400 && responseData?.data?.[0] === "errors") {
					const errors = responseData.data[1];
					const errorMessages = Object.values(errors)
						.flat()
						.join('\n');
					toast.custom(
						(t) => (
							<div className={`${
								t.visible ? 'animate-enter' : 'animate-leave'
							} w-max max-w-[calc(100vw-32px)] min-w-[250px] bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
								<div className="flex-1 p-4">
									<div className="flex items-start">
										<div className="flex-shrink-0 pt-0.5">
											<X className="h-5 w-5 text-red-500" />
										</div>
										<div className="ml-3">
											<p className="text-sm font-medium text-red-500">
												{responseData?.message}
											</p>
											<p className="mt-1 text-sm text-red-500 whitespace-pre-line">
												{errorMessages}
											</p>
										</div>
									</div>
								</div>
							</div>
						),
						{
							duration: 3000,
						}
					);
				} else {
					toast.error(responseData?.message || 'Something went wrong!');
				}
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Something went wrong!!');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-[800px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-xl font-semibold">{__("SMTP SETTINGS", "trigger")}</h2>
						<Sheet >
							<SheetTrigger asChild>
								<Button variant="outline">{__("Send Test Email", "trigger")}</Button>
							</SheetTrigger>
							<SheetContent className="z-[100000]">
								<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
								<SheetDescription>
									{__("Send a test email to verify your SMTP configuration.", "trigger")}
								</SheetDescription>
								<div className="mt-6 space-y-4">
									<div className="space-y-2">
										<Label>{__("From Email", "trigger")}</Label>
										<Input 
											value={form.watch('fromEmail')} 
											className="border-black-900 text-black-900 opacity-100 disabled:opacity-100 disabled:cursor-not-allowed" 
											disabled 
										/>
									</div>
									<div className="space-y-2">
										<Label>{__("To Email", "trigger")}</Label>
										<Input 
											placeholder="Enter recipient email" 
											className="border-gray-500"
											autoFocus
											// onChange={(e) => {
											// 	form.setValue('toEmail', e.target.value);
											// }}
										/>
									</div>
									<div className="flex justify-end">
										<Button variant="default">{__("Send Test Email", "trigger")}</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="smtpHost"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Host", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="smtp.hostinger.com" {...field} />
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
										<FormLabel className="text-gray-700">{__("Smtp Port", "trigger")}</FormLabel>
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
										<FormLabel className="text-gray-700">{__("Smtp Security", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="TLS" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="smtpUsername"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("Smtp Username", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger@triggerthread.com" {...field} />
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
										<FormLabel className="text-gray-700">{__("Smtp Password", "trigger")}</FormLabel>
										<FormControl>
											<Input type="password" placeholder="**********" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fromName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-700">{__("From Name", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger" {...field} />
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
										<FormLabel className="text-gray-700">{__("From Email", "trigger")}</FormLabel>
										<FormControl>
											<Input placeholder="trigger@triggerthread.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : __("Save Settings", "trigger")}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}