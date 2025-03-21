import { __ } from "@wordpress/i18n";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import config from "@/config";
import { ResponseType } from "@/utils/trigger-declaration";
import { toast } from "react-hot-toast";
import { ConnectionType } from "./connections/index";

const GeneralSettings = () => {
	const [connectionIsLoading, setConnectionIsLoading] = useState(true);
	const [logRetentionIsLoading, setLogRetentionIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [defaultConnection, setDefaultConnection] = useState<ConnectionType | null>(null);
	const [selectedProvider, setSelectedProvider] = useState<string>("none");
	const [logRetention, setLogRetention] = useState<string>("30");

	const fetchDefaultConnection = async () => {
		try {
			const formData = new FormData();
			formData.append('action', 'get_default_email_connection');
			formData.append('trigger_nonce', config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});
			const responseData = await response.json() as ResponseType;
			setDefaultConnection(responseData.data);

			// Set the selected provider based on the default connection
			if (responseData.data && responseData.data.provider) {
				setSelectedProvider(responseData.data.provider);
			}
		} catch (error) {
			console.error('Error fetching default connection:', error);
		}
	};

	const fetchConnections = async () => {
		try {
			const formData = new FormData();
			formData.append('action', 'get_email_connections');
			formData.append('trigger_nonce', config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});
			const responseData = await response.json() as ResponseType;
			setConnections(responseData.data || []);
		} catch (error) {
			console.error('Error fetching connections:', error);
		} finally {
			setConnectionIsLoading(false);
		}
	};

	const updateDefaultConnection = async (value: string) => {
		setIsSaving(true);
		setConnectionIsLoading(true);
		setSelectedProvider(value);
		try {
			const formData = new FormData();
			formData.append('action', 'update_default_connection');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('data', JSON.stringify({ provider: value }));

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as ResponseType;

			if (responseData.status_code === 200) {
				toast.success(__('Default connection updated successfully', 'trigger'));
			} else {
				toast.error(responseData.message || __('Failed to update default connection', 'trigger'));
			}
		} catch (error) {
			console.error('Error updating default connection:', error);
			toast.error(__('Failed to update default connection', 'trigger'));
		} finally {
			setIsSaving(false);
			setConnectionIsLoading(false);
		}
	};

	const fetchLogRetention = async () => {
		try {
			setLogRetentionIsLoading(true);
			const formData = new FormData();
			formData.append('action', 'get_log_retention');
			formData.append('trigger_nonce', config.nonce_value);
			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});
			const responseData = await response.json() as ResponseType;

			if (responseData.status_code === 200 && responseData.data) {
				// Ensure we're dealing with a string value
				const retentionValue = responseData.data.toString();
				setLogRetention(retentionValue);
			}
		} catch (error) {
			console.error('Error fetching log retention setting:', error);
		} finally {
			setLogRetentionIsLoading(false);
		}
	};

	const updateLogRetention = async (days: string) => {
		try {
			setIsSaving(true);
			setLogRetentionIsLoading(true);
			const formData = new FormData();
			formData.append('action', 'update_log_retention');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('data', JSON.stringify({ days }));

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as ResponseType;

			if (responseData.status_code === 200) {
				setLogRetention(responseData.data);
				toast.success(__('Log retention updated', 'trigger'));
			} else {
				toast.error(responseData.message || __('Failed to update log retention', 'trigger'));
			}
		} catch (error) {
			toast.error(__('Failed to update log retention', 'trigger'));
		} finally {
			setIsSaving(false);
			setLogRetentionIsLoading(false);
		}
	};

	useEffect(() => {
		fetchConnections();
		fetchDefaultConnection();
	}, []);

	useEffect(() => {
		fetchLogRetention();
	}, [logRetention]);

	// Get connection display info
	const getConnectionDisplay = (connection: ConnectionType) => {
		if (connection.provider === 'smtp') {
			return `SMTP: ${connection.fromEmail} (${connection.smtpHost})`;
		} else if (connection.provider === 'ses') {
			return `SES: ${connection.fromEmail} (${connection.region})`;
		}
		return connection.provider;
	};

	return (
		<div className="space-y-8 p-6">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">{__('General Settings', 'trigger')}</h3>
				{isSaving && (
					<div className="flex items-center text-sm text-muted-foreground">
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{__('Saving changes...', 'trigger')}
					</div>
				)}
			</div>

			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6 space-y-6">

					{/* Default Connection Section */}
					<div className="space-y-4 pt-4 border-t first:border-t-0 first:pt-0">
						<h3 className="text-lg font-medium">{__('Default Connection', 'trigger')}</h3>
						{connectionIsLoading ? (
							<div className="flex items-center space-x-2 h-[40px]">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>{__('Loading connections...', 'trigger')}</span>
							</div>
						) : (
							<Select
								value={selectedProvider}
								onValueChange={(value) => updateDefaultConnection(value)}
								disabled={connectionIsLoading || isSaving}
							>
								<SelectTrigger className="max-w-fit">
									<SelectValue placeholder={__('Select connection', 'trigger')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">
										{__('None', 'trigger')}
									</SelectItem>
									{connections.map((connection: ConnectionType) => (
										<SelectItem
											key={`${connection.provider}-${connection.fromEmail}`}
											value={connection.provider}
										>
											{getConnectionDisplay(connection)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
						<p className="text-muted-foreground">
							{__('This connection will be used by default unless a specific "from email" address is provided in the email headers.', 'trigger')}
						</p>
					</div>

					{/* Delete Logs Section */}
					<div className="space-y-4 pt-4 border-t">
						<div className="flex items-center space-x-2">
							<h3 className="text-lg font-medium">{__('Delete Logs', 'trigger')}</h3>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p>{__('Choose when to automatically delete email logs', 'trigger')}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{logRetentionIsLoading ? (
							<div className="flex items-center space-x-2 h-[40px]">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>{__('Loading log retention...', 'trigger')}</span>
							</div>
						) : (
							<>
								<Select
									key={`log-retention-${logRetention}`}
									value={logRetention}
									onValueChange={(value) => {
										setLogRetention(value);
										updateLogRetention(value);
									}}
									disabled={logRetentionIsLoading || isSaving}
									defaultValue={logRetention}
								>
									<SelectTrigger className="max-w-fit">
										<SelectValue placeholder={__('Select duration', 'trigger')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7">{__('Delete after 7 days', 'trigger')}</SelectItem>
										<SelectItem value="14">{__('Delete after 14 days', 'trigger')}</SelectItem>
										<SelectItem value="30">{__('Delete after 30 days', 'trigger')}</SelectItem>
										<SelectItem value="60">{__('Delete after 60 days', 'trigger')}</SelectItem>
										<SelectItem value="90">{__('Delete after 90 days', 'trigger')}</SelectItem>
										<SelectItem value="never">{__('Never delete', 'trigger')}</SelectItem>
									</SelectContent>
								</Select>
							</>
						)}
						<p className="text-muted-foreground">
							{__('Logs will be automatically deleted after the chosen duration.', 'trigger')}
						</p>
					</div>

				</div>
			</div>
		</div>
	);
};

export default GeneralSettings; 