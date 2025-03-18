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
import { ConnectionType } from "./index";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";

const ConnectionList = ({ initialConnections }: { initialConnections: ConnectionType[] }) => {
	const navigate = useNavigate();

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
										// 'border-blue-600 text-blue-600 hover:bg-blue-50'
										// connection.type === "ses"
										// 	? "border-blue-600 text-blue-600 hover:bg-blue-50"
										// 	: "border-green-600 text-green-600 hover:bg-green-50"
									)}
								>
									Send Test Email
								</Button>
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="icon">
										<PencilIcon className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon">
										<Trash2Icon className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ConnectionList;
