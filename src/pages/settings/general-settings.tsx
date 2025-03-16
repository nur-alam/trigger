import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const GeneralSettings = () => {
	return (
		<div className="space-y-8 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-tight">General Settings</h1>
				<Button className="min-w-[90px]" variant="default" size="sm">Save</Button>
			</div>

			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6 space-y-6">
					{/* Log Emails Section */}
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Switch id="log-emails" />
							<label htmlFor="log-emails" className="text-lg font-medium">Log Emails</label>
						</div>
						<p className="text-muted-foreground">
							Enable to log all outgoing emails for reference.
						</p>
					</div>

					{/* Delete Logs Section */}
					<div className="space-y-4 pt-4 border-t">
						<div className="flex items-center space-x-2">
							<h3 className="text-lg font-medium">Delete Logs</h3>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Choose when to automatically delete email logs</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Select defaultValue="30">
							<SelectTrigger className="w-full md:w-[300px]">
								<SelectValue placeholder="Select duration" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="7">Delete after 7 days</SelectItem>
								<SelectItem value="14">Delete after 14 days</SelectItem>
								<SelectItem value="30">Delete after 30 days</SelectItem>
								<SelectItem value="60">Delete after 60 days</SelectItem>
								<SelectItem value="90">Delete after 90 days</SelectItem>
								<SelectItem value="never">Never delete</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground">
							Logs will be automatically deleted after the chosen duration.
						</p>
					</div>

					{/* Default Connection Section */}
					<div className="space-y-4 pt-4 border-t">
						<h3 className="text-lg font-medium">Default Connection</h3>
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
							This connection will be used by default unless a specific "from email" address is provided in the email headers.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GeneralSettings; 