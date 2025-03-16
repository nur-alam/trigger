import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConnectionList from "./connection-list";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
export interface ConnectionType {
	id: string;
	name: string;
	email: string;
	type: "smtp" | "ses" | "gmail";
	status: "active" | "inactive";
	createdAt: string;
}

const initialConnections: ConnectionType[] = [
	// { id: "1", name: "SMTP Connection", email: "nuralam862@gmail.com", type: "smtp", status: "active", createdAt: "Mar 16, 2025, 10:37 AM" },
	// { id: "2", name: "SES Connection", email: "vocab@vocabthread.com", type: "ses", status: "inactive", createdAt: "Mar 16, 2025, 10:56 AM" },
	// { id: "3", name: "Gmail Connection", email: "nuralam862@gmail.com", type: "gmail", status: "active", createdAt: "Mar 16, 2025, 10:56 AM" },
];

const Connections = () => {
	const [connections, setConnections] = useState<ConnectionType[]>(initialConnections);
	const navigate = useNavigate();
	if (connections.length === 0) {
		return (
			<div className="flex min-h-[600px] flex-col items-center justify-center p-8">
				<div className="mx-auto max-w-md text-center">
					{/* Illustration */}
					<div className="mb-6">
						<img
							src="/wp-content/plugins/trigger/assets/images/empty-connections.svg"
							alt="Create your first connection"
							className="mx-auto h-48 w-auto"
						/>
					</div>

					{/* Content */}
					<h2 className="mb-4 text-2xl font-semibold tracking-tight">
						{__('Create Your First Connection', 'trigger')}
					</h2>
					<p className="mb-4 text-muted-foreground">
						{__('It looks like you haven\'t set up a SMTP connection yet. Connect to a reliable SMTP provider to ensure your emails are delivered effectively and securely.', 'trigger')}
					</p>

					<Button size="lg" className="gap-2" onClick={() => navigate('/add-connection')}>
						<PlusIcon className="h-5 w-5" />
						{__('Add Connection', 'trigger')}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<ConnectionList initialConnections={initialConnections} />
	);
};

export default Connections;
