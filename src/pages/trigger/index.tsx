// import { TableProvider } from './TableContext'
import DataTable from './DataTable'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, XCircle, PlusIcon } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import config from '@/config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { fetchUtil } from '@/utils/requestUtils';
import { TriggerResponseType } from '@/utils/trigger-declaration';
import toast from 'react-hot-toast';
import { useHandleGoogleOAuthCallback } from '@/services/connection-services';


interface EmailStats {
	total: number;
	success: number;
	failed: number;
	chart_data: {
		date: string;
		success: number;
		failed: number;
	}[];
}

const TriggerDashboard = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState<EmailStats>({
		total: 0,
		success: 0,
		failed: 0,
		chart_data: []
	});

	const fetchEmailStats = async () => {
		try {
			const formData = new FormData();
			formData.append('action', 'get_email_stats');
			formData.append('trigger_nonce', config.nonce_value);

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json();
			if (responseData.status_code === 200) {
				setStats(responseData.data);
			}
		} catch (error) {
			console.error('Error fetching email stats:', error);
		}
	};

	useEffect(() => {
		fetchEmailStats();
	}, []);

	const [searchParams] = useSearchParams();
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');

	const { mutateAsync: handleGoogleOAuthCallback } = useHandleGoogleOAuthCallback();

	useEffect(() => {
		if (code) {
			handleGoogleOAuthCallback({ 'code': code });
		}
	}, [code]);


	return (
		<div className="p-4 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">{__('Trigger Dashboard', 'trigger')}</h2>
				<Button size="sm" className="gap-2" onClick={() => navigate('/add-connection')}>
					<PlusIcon className="h-5 w-5" />
					{__('Add Connection', 'trigger')}
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{__('Total Emails', 'trigger')}
						</CardTitle>
						<Mail className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{__('Successful', 'trigger')}
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{stats.success}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{__('Failed', 'trigger')}
						</CardTitle>
						<XCircle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{stats.failed}</div>
					</CardContent>
				</Card>
			</div>

			{/* Email Sending Rate Chart */}
			<Card>
				<CardHeader>
					<CardTitle>{__('Email Sending Rate', 'trigger')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={stats.chart_data}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="date"
									tickFormatter={(value: string) => format(new Date(value), 'MMM dd')}
								/>
								<YAxis />
								<Tooltip
									labelFormatter={(value: string) => format(new Date(value), 'MMM dd, yyyy')}
								/>
								<Line
									type="monotone"
									dataKey="success"
									stroke="#16a34a"
									name={__('Successful', 'trigger')}
								/>
								<Line
									type="monotone"
									dataKey="failed"
									stroke="#dc2626"
									name={__('Failed', 'trigger')}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default TriggerDashboard