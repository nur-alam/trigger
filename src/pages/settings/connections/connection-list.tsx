import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionType } from "@/pages/settings/connections/index";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { SetStateAction, Dispatch, useState } from "react";
import { TestEmailSheet } from "@/pages/settings/connections/test-email-sheet";
import { EditConnectionSheet } from "@/pages/settings/connections/edit-connection";
import { DeleteConnectionSheet } from "@/pages/settings/connections/delete-connection";

const ConnectionList = ({ initialConnections, setInitialConnections }: { initialConnections: ConnectionType[], setInitialConnections: Dispatch<SetStateAction<ConnectionType[]>> }) => {
	const navigate = useNavigate();
	const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
	const [isTestEmailSheetOpen, setIsTestEmailSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);

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
		<div className="rounded-md border mt-10">
			<div className="flex justify-end py-3">
				<Button size="sm" className="gap-2" onClick={() => navigate('/add-connection')}>
					<PlusIcon className="h-5 w-5" />
					{__('Add Connection', 'trigger')}
				</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Connection</TableHead>
						<TableHead>Connection Title</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className="cursor-pointer">Created On ↓</TableHead>
						<TableHead>Test Email</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{initialConnections.map((connection, index) => (
						<TableRow key={index}>
							<TableCell>
								{connection.provider === 'ses' ? (
									<img
										src="/wp-content/plugins/trigger/assets/images/aws-logo.png"
										alt="AWS"
										className="h-8 w-8"
									/>
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
								<Button
									variant="outline"
									size="sm"
									className={cn(
										"gap-2 text-blue-600 hover:bg-blue-500 hover:text-white",
									)}
									onClick={() => handleTestEmail(connection)}
								>
									Send Test Email
								</Button>
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

			{selectedConnection && (
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
			)}
		</div>
	);
};

export default ConnectionList;
