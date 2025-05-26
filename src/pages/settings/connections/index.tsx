import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConnectionList from "./connection-list";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { EmailProviderOptionsType, TriggerResponseType } from "@/utils/trigger-declaration";
import { useGetAllProviders } from "@/services/connection-services";

export interface ConnectionType {
	fromEmail: string;
	fromName: string;
	provider: EmailProviderOptionsType;
	smtpHost?: string;
	smtpPort?: string;
	smtpSecurity?: string;
	smtpUsername?: string;
	smtpPassword?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	region?: string;
	clientId?: string;
	clientSecret?: string;
	createdAt: string;
}

const EmptyState = ({ onAddConnection }: { onAddConnection: () => void }) => (
	<div className="mx-auto max-w-md text-center">
		<div className="flex justify-center mb-6 mt-10">
			<svg width="200" height="100" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* Background Shape */}
				<path d="M50 150C50 80 120 30 200 30C280 30 350 80 350 150C350 220 280 270 200 270C120 270 50 220 50 150Z" fill="#F3F4F6" opacity="0.5" />

				{/* Connection Lines */}
				<path d="M120 150C120 150 160 100 200 100C240 100 280 150 280 150" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
				<path d="M120 170C120 170 160 220 200 220C240 220 280 170 280 170" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />

				{/* Connection Points */}
				<circle cx="120" cy="150" r="8" fill="#6B7280" />
				<circle cx="280" cy="150" r="8" fill="#6B7280" />
				<circle cx="120" cy="170" r="8" fill="#6B7280" />
				<circle cx="280" cy="170" r="8" fill="#6B7280" />

				{/* Central Icon */}
				<g transform="translate(160, 120)">
					{/* Email Icon */}
					<rect x="0" y="0" width="80" height="60" rx="4" fill="#4F46E5" />
					<path d="M0 10L40 35L80 10" stroke="white" strokeWidth="2" fill="none" />
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
					<path d="M0 5L20 20L40 5" stroke="white" strokeWidth="1" fill="none" />
				</g>
				<g transform="translate(300, 200) scale(0.5)">
					<rect width="40" height="30" rx="2" fill="#6B7280" opacity="0.5" />
					<path d="M0 5L20 20L40 5" stroke="white" strokeWidth="1" fill="none" />
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
	const navigate = useNavigate();

	const { data: allProviders, isLoading } = useGetAllProviders();
	useEffect(() => {
		if (allProviders) {
			setConnections(allProviders.data);
		}
	}, [allProviders]);

	return (
		<div className="min-h-[600px] pr-4">
			{isLoading ? (
				<LoadingState />
			) : connections.length === 0 ? (
				<div className="flex items-center justify-center h-full">
					<EmptyState onAddConnection={() => navigate('/add-connection')} />
				</div>
			) : (
				<ConnectionList initialConnections={connections} setInitialConnections={setConnections} />
			)}
		</div>
	);
};

export default Connections;
