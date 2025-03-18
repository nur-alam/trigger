import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, Trash2Icon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionType } from "./index";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { SetStateAction, Dispatch, useState } from "react";
import { TestEmailSheet } from "./test-email-sheet";
import { EditConnectionSheet } from "./edit-connection-sheet";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import config from "@/config";
import toast from "react-hot-toast";

const ConnectionList = ({ initialConnections, setInitialConnections }: { initialConnections: ConnectionType[], setInitialConnections: Dispatch<SetStateAction<ConnectionType[]>> }) => {
	const navigate = useNavigate();
	const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
	const [isTestEmailSheetOpen, setIsTestEmailSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [deleteConnection, setDeleteConnection] = useState<ConnectionType | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleTestEmail = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsTestEmailSheetOpen(true);
	};

	const handleEditConnection = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsEditSheetOpen(true);
	};

	const handleDeleteConnection = (connection: ConnectionType) => {
		setDeleteConnection(connection);
	};

	const handleConnectionUpdated = () => {
		// Reload the page or fetch connections again
		window.location.reload();
	};

	const handleDelete = async () => {
		if (!deleteConnection) return;

		setIsDeleting(true);
		try {
			const formData = new FormData();
			formData.append("action", "delete_email_config");
			formData.append("trigger_nonce", config.nonce_value);
			formData.append("provider", deleteConnection.provider);

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const responseData = await response.json();

			if (responseData?.status_code === 200) {
				// Make sure the connections are an array 
				const updatedConnections = Array.isArray(responseData.data) ? responseData.data : [];
				setInitialConnections(updatedConnections);
				toast.success(responseData.message || __("Connection deleted successfully!"));
			} else {
				toast.error(responseData.message || __("Failed to delete connection. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
			console.error("Error deleting connection:", error);
		} finally {
			setIsDeleting(false);
			setDeleteConnection(null);
		}
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
							<TableCell>{connection.from_email}</TableCell>
							<TableCell>{connection.created_at}</TableCell>
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
						onConnectionUpdated={handleConnectionUpdated}
					/>
				</>
			)}

			{/* Delete Confirmation Dialog */}
			<ConfirmationDialog
				open={!!deleteConnection}
				onOpenChange={(open) => !open && setDeleteConnection(null)}
				title={__('Delete Connection', 'trigger')}
				description={__('Are you sure you want to delete this connection? This action cannot be undone.', 'trigger')}
				icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
				variant="danger"
				confirmText={__('Delete', 'trigger')}
				cancelText={__('Cancel', 'trigger')}
				onConfirm={handleDelete}
				loading={isDeleting}
				loadingText={__('Deleting...', 'trigger')}
			>
				{deleteConnection && (
					<div className="space-y-2 mt-2 mb-4">
						<div className="grid grid-cols-2 gap-2">
							<div>
								<span className="font-medium">{__('Provider:', 'trigger')}</span>
								<p className="text-sm text-muted-foreground">{deleteConnection.provider}</p>
							</div>
							<div>
								<span className="font-medium">{__('Email:', 'trigger')}</span>
								<p className="text-sm text-muted-foreground">{deleteConnection.from_email}</p>
							</div>
						</div>
					</div>
				)}
			</ConfirmationDialog>
		</div>
	);
};

export default ConnectionList;
