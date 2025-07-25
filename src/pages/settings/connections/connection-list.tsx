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
import { useNavigate, useSearchParams } from "react-router-dom";
import { SetStateAction, Dispatch, useState } from "react";
import { TestEmailSheet } from "@/pages/settings/connections/test-email-sheet";
import { EditConnectionSheet } from "@/pages/settings/connections/edit-connection";
import { DeleteConnectionSheet } from "@/pages/settings/connections/delete-connection";
import { VerifySesEmailSheet } from "./verify-ses-email";
import { getProviderFullName } from "@/utils/utils";
import toast from "react-hot-toast";
import config from "@/config";
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
									<svg width="25" height="25" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0_214_10729)">
											<path d="M80 0H0V80H80V0Z" fill="url(#paint0_linear_214_10729)" />
											<path fill-rule="evenodd" clip-rule="evenodd" d="M57 60.9999C57 59.3738 55.626 57.9998 54 57.9998C52.374 57.9998 51 59.3738 51 60.9999C51 62.6259 52.374 63.9999 54 63.9999C55.626 63.9999 57 62.6259 57 60.9999ZM40 59.9999C38.374 59.9999 37 61.3739 37 62.9999C37 64.6259 38.374 66 40 66C41.626 66 43 64.6259 43 62.9999C43 61.3739 41.626 59.9999 40 59.9999ZM26 57.9998C24.374 57.9998 23 59.3738 23 60.9999C23 62.6259 24.374 63.9999 26 63.9999C27.626 63.9999 29 62.6259 29 60.9999C29 59.3738 27.626 57.9998 26 57.9998ZM28.605 42.9996H51.395L43.739 36.1104L40.649 38.7585C40.463 38.9195 40.23 38.9995 39.999 38.9995C39.768 38.9995 39.535 38.9195 39.349 38.7585L36.26 36.1104L28.605 42.9996ZM27 28.1733V41.7545L34.729 34.7984L27 28.1733ZM51.297 26.9993H28.703L39.999 36.6824L51.297 26.9993ZM53 41.7545V28.1733L45.271 34.7974L53 41.7545ZM59 60.9999C59 63.7099 56.71 66 54 66C51.29 66 49 63.7099 49 60.9999C49 58.6308 50.75 56.5838 53 56.1058V52.9997H41V58.1058C43.25 58.5838 45 60.6309 45 62.9999C45 65.71 42.71 68 40 68C37.29 68 35 65.71 35 62.9999C35 60.6309 36.75 58.5838 39 58.1058V52.9997H27V56.1058C29.25 56.5838 31 58.6308 31 60.9999C31 63.7099 28.71 66 26 66C23.29 66 21 63.7099 21 60.9999C21 58.6308 22.75 56.5838 25 56.1058V51.9997C25 51.4477 25.447 50.9997 26 50.9997H39V44.9996H26C25.447 44.9996 25 44.5516 25 43.9996V25.9993C25 25.4472 25.447 24.9992 26 24.9992H54C54.553 24.9992 55 25.4472 55 25.9993V43.9996C55 44.5516 54.553 44.9996 54 44.9996H41V50.9997H54C54.553 50.9997 55 51.4477 55 51.9997V56.1058C57.25 56.5838 59 58.6308 59 60.9999ZM68 39.9995C68 45.9066 66.177 51.5597 62.727 56.3448L61.104 55.1748C64.307 50.7317 66 45.4846 66 39.9995C66 25.6642 54.337 14 40.001 14C25.664 14 14 25.6642 14 39.9995C14 45.4846 15.693 50.7317 18.896 55.1748L17.273 56.3448C13.823 51.5597 12 45.9066 12 39.9995C12 24.5612 24.561 12 39.999 12C55.438 12 68 24.5612 68 39.9995Z" fill="white" />
										</g>
										<defs>
											<linearGradient id="paint0_linear_214_10729" x1="0" y1="8000" x2="8000" y2="0" gradientUnits="userSpaceOnUse">
												<stop stop-color="#3334B9" />
												<stop offset="1" stop-color="#4E74F4" />
											</linearGradient>
											<clipPath id="clip0_214_10729">
												<rect width="80" height="80" fill="white" />
											</clipPath>
										</defs>
									</svg>
								) : (
									<svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect width="20" height="20" rx="2" fill="#5278FF" />
										<path d="M15.0714 4H4.78571C4.07563 4 3.5 4.67157 3.5 5.5V14.5C3.5 15.3284 4.07563 16 4.78571 16H15.0714C15.7815 16 16.3571 15.3284 16.3571 14.5V5.5C16.3571 4.67157 15.7815 4 15.0714 4Z" stroke="white" strokeWidth="0.833333" />
										<path d="M16 8L10.618 11.8025C10.4328 11.9316 10.2186 12 10 12C9.78141 12 9.56724 11.9316 9.382 11.8025L4 8" stroke="white" strokeWidth="0.833333" />
									</svg>
								)}
							</TableCell>
							<TableCell>{getProviderFullName(connection.provider)}</TableCell>
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
										<Trash2Icon className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table >

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
