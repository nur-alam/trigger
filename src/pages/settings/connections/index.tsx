import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConnectionList from "./connection-list";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import config from "@/config";
import { EmailProvider } from "./add-connection";
export interface ConnectionType {
	// id: string;
	// name: string;
	// email: string;
	// type: "smtp" | "ses" | "gmail";
	// status: "active" | "inactive";
	// createdAt: string;
	from_email: string;
	from_name: string;
	provider: EmailProvider;
	smtp_host?: string;
	smtp_port?: string;
	smtp_security?: string;
	smtp_username?: string;
	smtp_password?: string;
	access_key_id?: string;
	secret_access_key?: string;
	region?: string;
	created_at: string;
}

// const initialConnections: ConnectionType[] = [
// 	{ id: "1", name: "SMTP Connection", email: "nuralam862@gmail.com", type: "smtp", status: "active", createdAt: "Mar 16, 2025, 10:37 AM" },
// 	{ id: "2", name: "SES Connection", email: "vocab@vocabthread.com", type: "ses", status: "inactive", createdAt: "Mar 16, 2025, 10:56 AM" },
// 	{ id: "3", name: "Gmail Connection", email: "nuralam862@gmail.com", type: "gmail", status: "active", createdAt: "Mar 16, 2025, 10:56 AM" },
// ];

const EmptyState = ({ onAddConnection }: { onAddConnection: () => void }) => (
	<div className="mx-auto max-w-md text-center">
		<div className="flex justify-center mb-6">
			<svg width="200" height="100" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* Background Shape */}
				<path d="M50 150C50 80 120 30 200 30C280 30 350 80 350 150C350 220 280 270 200 270C120 270 50 220 50 150Z" fill="#F3F4F6" opacity="0.5" />

				{/* Connection Lines */}
				<path d="M120 150C120 150 160 100 200 100C240 100 280 150 280 150" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4" />
				<path d="M120 170C120 170 160 220 200 220C240 220 280 170 280 170" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4" />

				{/* Connection Points */}
				<circle cx="120" cy="150" r="8" fill="#6B7280" />
				<circle cx="280" cy="150" r="8" fill="#6B7280" />
				<circle cx="120" cy="170" r="8" fill="#6B7280" />
				<circle cx="280" cy="170" r="8" fill="#6B7280" />

				{/* Central Icon */}
				<g transform="translate(160, 120)">
					{/* Email Icon */}
					<rect x="0" y="0" width="80" height="60" rx="4" fill="#4F46E5" />
					<path d="M0 10L40 35L80 10" stroke="white" stroke-width="2" fill="none" />
				</g>

				{/* Decorative Elements */}
				<circle cx="150" cy="80" r="5" fill="#4F46E5" opacity="0.5" />
				<circle cx="250" cy="80" r="5" fill="#4F46E5" opacity="0.5" />
				<circle cx="150" cy="220" r="5" fill="#4F46E5" opacity="0.5" />
				<circle cx="250" cy="220" r="5" fill="#4F46E5" opacity="0.5" />

				{/* Paper Airplane */}
				<path d="M320 60L340 80L300 120" fill="#4F46E5" opacity="0.7" />
				<path d="M320 60L300 120L310 90" fill="#4F46E5" />

				{/* Small Envelopes */}
				<g transform="translate(80, 100) scale(0.5)">
					<rect width="40" height="30" rx="2" fill="#6B7280" opacity="0.5" />
					<path d="M0 5L20 20L40 5" stroke="white" stroke-width="1" fill="none" />
				</g>
				<g transform="translate(300, 200) scale(0.5)">
					<rect width="40" height="30" rx="2" fill="#6B7280" opacity="0.5" />
					<path d="M0 5L20 20L40 5" stroke="white" stroke-width="1" fill="none" />
				</g>
			</svg>
		</div>
		<h2 className="mb-4 text-2xl font-semibold tracking-tight">
			{__('Create Your First Connection', 'trigger')}
		</h2>
		<p className="mb-4 text-muted-foreground">
			{__('It looks like you haven\'t set up a SMTP connection yet. Connect to a reliable SMTP provider to ensure your emails are delivered effectively and securely.', 'trigger')}
		</p>
		<Button size="lg" className="gap-2" onClick={onAddConnection}>
			<PlusIcon className="h-5 w-5" />
			{__('Add Connection', 'trigger')}
		</Button>
	</div>
);

const LoadingState = () => (
	<div className="flex items-center justify-center min-h-[400px]">
		<div className="animate-pulse space-y-4">
			<div className="h-4 w-[550px] bg-gray-200 rounded"></div>
			<div className="h-4 w-[550px] bg-gray-200 rounded"></div>
			<div className="h-4 w-[550px] bg-gray-200 rounded"></div>
		</div>
	</div>
);

const Connections = () => {
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const formData = new FormData();
				formData.append('action', 'get_email_connections');
				formData.append('trigger_nonce', config.nonce_value);
				const response = await fetch(config.ajax_url, {
					method: 'POST',
					body: formData,
				});

				const responseData = await response.json();
				setConnections(responseData.data);
			} catch (error) {
				console.error('Error fetching connections:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchConnections();
	}, []);

	return (
		<div className="min-h-[600px] p-8">
			{isLoading ? (
				<LoadingState />
			) : connections.length === 0 ? (
				<div className="flex items-center justify-center h-full">
					<EmptyState onAddConnection={() => navigate('/add-connection')} />
				</div>
			) : (
				<ConnectionList initialConnections={connections} />
			)}
		</div>
	);
};

export default Connections;
