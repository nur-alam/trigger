import { __ } from "@wordpress/i18n";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import DefaultSmtp from "./provider/default-smtp";
import AwsSes from "./provider/aws-ses";
import { useState } from "react";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmailProviderOptionsType } from "@/utils/trigger-declaration";




const AddConnection = () => {
	const navigate = useNavigate();
	const [selectedProvider, setSelectedProvider] = useState<EmailProviderOptionsType>("smtp");
	const [open, setOpen] = useState(false);
	return (
		<div className="flex justify-center mt-5 p-5">
			<Card className="w-full max-w-[1000px] shadow-lg">
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-xl font-semibold">{__("Email Settings", "trigger")}</h2>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={() => navigate('/connections')}>
								<MoveLeft className="w-4 h-4 mr-2" />
								{__("Back", "trigger")}
							</Button>
							{/* <h2 className="text-xl font-semibold">{__("Email Settings", "trigger")}</h2> */}
						</div>
						{/* <Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button variant="outline">{__("Send Test Email", "trigger")}</Button>
							</SheetTrigger>
							<SheetContent className="z-[99999]">
								<SheetTitle>{__("Send Test Email", "trigger")}</SheetTitle>
								<SheetDescription>
									{__("Send a test email to verify your email configuration.", "trigger")}
								</SheetDescription> */}
						{/* <div className="mt-6 space-y-4">
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
											value={toEmail}
											onChange={(e) => setToEmail(e.target.value)}
										/>
									</div>
									<div className="flex justify-end">
										<Button variant="default" onClick={handleTestEmail} disabled={isTestingEmail || !toEmail}>
											{isTestingEmail ? "Sending..." : "Send Test Email"}
										</Button>
									</div>
								</div> */}
						{/* </SheetContent>
						</Sheet> */}
					</div>
					<Tabs
						defaultValue="smtp"
						className="flex gap-6"
						onValueChange={(value) => {
							setSelectedProvider(value as EmailProviderOptionsType);
						}}
					>
						<TabsList className="flex flex-col h-fit w-48 bg-muted p-2 rounded-lg">
							<TabsTrigger value="smtp" className="w-full justify-start gap-2 p-2.5">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<rect width="20" height="16" x="2" y="4" rx="2" />
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								</svg>
								SMTP
							</TabsTrigger>
							<TabsTrigger value="ses" className="w-full justify-start gap-2 p-2.5">
								<img
									src="/wp-content/plugins/trigger/assets/images/aws-logo.png"
									alt="AWS"
									className="h-5 w-5"
								/>
								Amazon SES
							</TabsTrigger>
						</TabsList>

						<div className="flex-1 border-l pl-6">
							<TabsContent value="smtp">
								<DefaultSmtp selectedProvider={selectedProvider} />
							</TabsContent>

							<TabsContent value="ses">
								<AwsSes selectedProvider={selectedProvider} />
							</TabsContent>
						</div>
					</Tabs>
				</CardContent>
			</Card>
		</div >
	);
};

export default AddConnection;