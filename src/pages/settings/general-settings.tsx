import { __ } from "@wordpress/i18n";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const GeneralSettings = () => {
	return (
		<div className="space-y-8 p-6">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">{__('General Settings', 'trigger')}</h3>
				<Button className="min-w-[90px]" variant="default" size="sm">{__('Update', 'trigger')}</Button>
			</div>

			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6 space-y-6">

					{/* Default Connection Section */}
					<div className="space-y-4 pt-4 border-t">
						<h3 className="text-lg font-medium">{__('Default Connection', 'trigger')}</h3>
						<Select defaultValue="none">
							<SelectTrigger className="w-full md:w-[300px]">
								<SelectValue placeholder="Select connection" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None</SelectItem>
								<SelectItem value="smtp1">SMTP Connection 1</SelectItem>
								<SelectItem value="smtp2">SMTP Connection 2</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground">
							{__('This connection will be used by default unless a specific "from email" address is provided in the email headers.', 'trigger')}
						</p>
					</div>

					{/* Log Emails Section */}
					{/* <div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Switch id="log-emails" />
							<label htmlFor="log-emails" className="text-lg font-medium">{__('Log Emails', 'trigger')}</label>
						</div>
						<p className="text-muted-foreground">
							{__('Enable to log all outgoing emails for reference.', 'trigger')}
						</p>
					</div> */}

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
						<Select defaultValue="30">
							<SelectTrigger className="w-full md:w-[300px]">
								<SelectValue placeholder="Select duration" />
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