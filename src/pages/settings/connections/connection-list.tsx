import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionType } from "@/pages/settings/connections/index";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { SetStateAction, Dispatch, useState } from "react";
import { TestEmailSheet } from "@/pages/settings/connections/test-email-sheet";
import { EditConnectionSheet } from "@/pages/settings/connections/edit-connection";
import { DeleteConnectionSheet } from "@/pages/settings/connections/delete-connection";
import { VerifySesEmailSheet } from "./verify-ses-email";

const ConnectionList = ({ initialConnections, setInitialConnections }: { initialConnections: ConnectionType[], setInitialConnections: Dispatch<SetStateAction<ConnectionType[]>> }) => {
	const navigate = useNavigate();
	const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
	const [isTestEmailSheetOpen, setIsTestEmailSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
	const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);

	const handleTestEmail = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsTestEmailSheetOpen(true);
	};

	const handleEditConnection = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsEditSheetOpen(true);
	};

	const handleDeleteConnection = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsDeleteSheetOpen(true);
	};

	const handleConnectionUpdated = () => {
		// Reload the page or fetch connections again
		window.location.reload();
	};

	return (
		<div className="rounded-md border mt-10 p-4">
			<div className="flex justify-between py-3 mb-3" >
				<h3 className="text-lg font-medium">{__('Connection List', 'trigger')}</h3>
				<Button size="sm" className="gap-2" onClick={() => navigate('/add-connection')}>
					<PlusIcon className="h-5 w-5" />
					{__('Add Connection', 'trigger')}
				</Button>
			</div >
			<Table className="border-solid border border-rounded-md border-gray-200">
				<TableHeader className="bg-gray-100">
					<TableRow>
						<TableHead>{__('Connection', 'trigger')}</TableHead>
						<TableHead>{__('Provider', 'trigger')}</TableHead>
						<TableHead>{__('Email', 'trigger')}</TableHead>
						<TableHead className="cursor-pointer">{__('Created On ↓', 'trigger')}</TableHead>
						<TableHead>{__('Test Email', 'trigger')}</TableHead>
						<TableHead>{__('Actions', 'trigger')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{initialConnections.map((connection, index) => (
						<TableRow key={index}>
							<TableCell>
								{connection.provider === 'ses' ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
										<polyline points="3.5 8.5 12 15 20.5 8.5" />
										<line x1="12" y1="15" x2="12" y2="11" />
										<path d="M12 11 L16 8" />
										<path d="M12 11 L8 8" />
									</svg>
								) : (
									<div className="flex h-8 w-8 items-center justify-center rounded-sm border">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<rect width="20" height="16" x="2" y="4" rx="2" />
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
										</svg>
									</div>
								)}
							</TableCell>
							<TableCell>{connection.provider}</TableCell>
							<TableCell>{connection.fromEmail}</TableCell>
							<TableCell>{connection.createdAt}</TableCell>
							<TableCell>
								<div className="flex flex-wrap items-center gap-2">
									<Button
										variant="secondary"
										size="sm"
										className=" text-blue-600 hover:bg-blue-500 hover:text-white"
										onClick={() => handleTestEmail(connection)}
									>
										{__('Send Test Email', 'trigger')}
									</Button>
									{connection.provider === 'ses' && (
										<>
											<Button
												variant="outline"
												size="sm"
												// className=" text-blue-600 hover:bg-blue-500 hover:text-white"
												onClick={() => setIsVerifyEmailOpen(true)}
											>
												{__("Verify Email", "trigger")}
											</Button>
											<VerifySesEmailSheet
												open={isVerifyEmailOpen}
												onOpenChange={setIsVerifyEmailOpen}
												connection={connection}
											/>
										</>
									)}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleEditConnection(connection)}
									>
										<PencilIcon className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteConnection(connection)}
									>
										<Trash2Icon className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{
				selectedConnection && (
					<>
						<TestEmailSheet
							open={isTestEmailSheetOpen}
							onOpenChange={setIsTestEmailSheetOpen}
							connection={selectedConnection}
						/>
						<EditConnectionSheet
							open={isEditSheetOpen}
							onOpenChange={setIsEditSheetOpen}
							connection={selectedConnection}
						/>
						<DeleteConnectionSheet
							open={isDeleteSheetOpen}
							onOpenChange={setIsDeleteSheetOpen}
							connection={selectedConnection}
							setInitialConnections={setInitialConnections}
						/>
					</>
				)
			}
		</div >
	);
};

export default ConnectionList;
