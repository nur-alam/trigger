import React, { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { __ } from "@wordpress/i18n";
import config from "@/config";
import { ConnectionType } from "./index";

interface EditConnectionSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
	onConnectionUpdated: () => void;
}

export function EditConnectionSheet({
	open,
	onOpenChange,
	connection,
	onConnectionUpdated
}: EditConnectionSheetProps) {
	const [formData, setFormData] = useState({
		provider: "",
		fromName: "",
		fromEmail: "",
		smtpHost: "",
		smtpPort: "",
		smtpSecurity: "",
		smtpUsername: "",
		smtpPassword: "",
		accessKeyId: "",
		secretAccessKey: "",
		region: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	// Load connection data into form
	useEffect(() => {
		if (connection) {
			setFormData({
				provider: connection.provider,
				fromName: connection.from_name,
				fromEmail: connection.from_email,
				smtpHost: connection.smtp_host || "",
				smtpPort: connection.smtp_port || "",
				smtpSecurity: connection.smtp_security || "",
				smtpUsername: connection.smtp_username || "",
				smtpPassword: connection.smtp_password || "",
				accessKeyId: connection.access_key_id || "",
				secretAccessKey: connection.secret_access_key || "",
				region: connection.region || "",
			});
		}
	}, [connection]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSelectChange = (id: string, value: string) => {
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const data = {
				provider: formData.provider,
				fromName: formData.fromName,
				fromEmail: formData.fromEmail,
				...(formData.provider === "smtp" ? {
					smtpHost: formData.smtpHost,
					smtpPort: formData.smtpPort,
					smtpSecurity: formData.smtpSecurity,
					smtpUsername: formData.smtpUsername,
					smtpPassword: formData.smtpPassword,
				} : {
					accessKeyId: formData.accessKeyId,
					secretAccessKey: formData.secretAccessKey,
					region: formData.region,
				}),
			};

			const formDataObj = new FormData();
			formDataObj.append("action", "update_email_config");
			formDataObj.append("trigger_nonce", config.nonce_value);
			formDataObj.append("data", JSON.stringify(data));

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formDataObj,
			});

			const responseData = await response.json();

			if (responseData.code === 200) {
				toast.success(__("Connection updated successfully!", "trigger"));
				onConnectionUpdated();
				onOpenChange(false);
			} else {
				toast.error(responseData.message || __("Failed to update connection. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
			console.error("Error updating connection:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-md">
				<SheetHeader>
					<SheetTitle>{__("Edit Connection", "trigger")}</SheetTitle>
					<SheetDescription>
						{__("Update your email connection settings.", "trigger")}
					</SheetDescription>
				</SheetHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="provider">{__("Provider", "trigger")}</Label>
						<Input id="provider" value={formData.provider} disabled />
					</div>

					<div className="space-y-2">
						<Label htmlFor="fromName">{__("From Name", "trigger")}</Label>
						<Input
							id="fromName"
							placeholder="Sender Name"
							value={formData.fromName}
							onChange={handleChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="fromEmail">{__("From Email", "trigger")}</Label>
						<Input
							id="fromEmail"
							type="email"
							placeholder="sender@example.com"
							value={formData.fromEmail}
							onChange={handleChange}
						/>
					</div>

					{formData.provider === "smtp" && (
						<>
							<div className="space-y-2">
								<Label htmlFor="smtpHost">{__("SMTP Host", "trigger")}</Label>
								<Input
									id="smtpHost"
									placeholder="smtp.example.com"
									value={formData.smtpHost}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="smtpPort">{__("SMTP Port", "trigger")}</Label>
								<Input
									id="smtpPort"
									placeholder="587"
									value={formData.smtpPort}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="smtpSecurity">{__("Security", "trigger")}</Label>
								<Select
									value={formData.smtpSecurity}
									onValueChange={(value) => handleSelectChange("smtpSecurity", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder={__("Select security type", "trigger")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">{__("None", "trigger")}</SelectItem>
										<SelectItem value="ssl">{__("SSL", "trigger")}</SelectItem>
										<SelectItem value="tls">{__("TLS", "trigger")}</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="smtpUsername">{__("SMTP Username", "trigger")}</Label>
								<Input
									id="smtpUsername"
									placeholder="username"
									value={formData.smtpUsername}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="smtpPassword">{__("SMTP Password", "trigger")}</Label>
								<Input
									id="smtpPassword"
									type="password"
									placeholder="••••••••"
									value={formData.smtpPassword}
									onChange={handleChange}
								/>
							</div>
						</>
					)}

					{formData.provider === "ses" && (
						<>
							<div className="space-y-2">
								<Label htmlFor="accessKeyId">{__("Access Key ID", "trigger")}</Label>
								<Input
									id="accessKeyId"
									placeholder="AKIAXXXXXXXXXXXXXXXX"
									value={formData.accessKeyId}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="secretAccessKey">{__("Secret Access Key", "trigger")}</Label>
								<Input
									id="secretAccessKey"
									type="password"
									placeholder="••••••••••••••••••••••••••••••••"
									value={formData.secretAccessKey}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="region">{__("Region", "trigger")}</Label>
								<Select
									value={formData.region}
									onValueChange={(value) => handleSelectChange("region", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder={__("Select region", "trigger")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="us-east-1">{__("US East (N. Virginia)", "trigger")}</SelectItem>
										<SelectItem value="us-east-2">{__("US East (Ohio)", "trigger")}</SelectItem>
										<SelectItem value="us-west-1">{__("US West (N. California)", "trigger")}</SelectItem>
										<SelectItem value="us-west-2">{__("US West (Oregon)", "trigger")}</SelectItem>
										<SelectItem value="af-south-1">{__("Africa (Cape Town)", "trigger")}</SelectItem>
										<SelectItem value="ap-east-1">{__("Asia Pacific (Hong Kong)", "trigger")}</SelectItem>
										<SelectItem value="ap-south-1">{__("Asia Pacific (Mumbai)", "trigger")}</SelectItem>
										<SelectItem value="ap-northeast-1">{__("Asia Pacific (Tokyo)", "trigger")}</SelectItem>
										<SelectItem value="ap-southeast-1">{__("Asia Pacific (Singapore)", "trigger")}</SelectItem>
										<SelectItem value="eu-central-1">{__("Europe (Frankfurt)", "trigger")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</>
					)}
				</div>

				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">{__("Cancel", "trigger")}</Button>
					</SheetClose>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{__("Updating...", "trigger")}
							</>
						) : (
							__("Save Changes", "trigger")
						)}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
} 