import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Connections from './pages/settings/connections';
import GeneralSettings from './pages/settings/general-settings';
import AddConnection from './pages/settings/connections/add-connection';
import Header from './components/Header';
import TriggerDashboard from './pages/trigger';
import EmailLogs from '@/pages/email-logs';
import Settings from './pages/settings';
import { Toaster } from 'react-hot-toast';
const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

root.render(
	<HashRouter>
		{/* <App /> */}
		<Header />
		<Routes>
			<Route path="/" element={<TriggerDashboard />} />
			<Route path="/dashboard" element={<TriggerDashboard />} />
			<Route path="/email_logs" element={<EmailLogs />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/connections" element={<Connections />} />
			<Route path="/general" element={<GeneralSettings />} />
			<Route path="/add-connection" element={<AddConnection />} />
		</Routes>

		<Toaster
			position="bottom-right"
			// position="bottom-center"
			containerClassName="!z-[9999999]"
			toastOptions={{
				duration: 5000,
				style: {
					background: '#fff',
					color: '#333',
					border: '1px solid #e5e7eb',
					padding: '16px',
					borderRadius: '8px',
					boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				},
				success: {
					style: {
						background: '#f0fdf4',
						borderColor: '#86efac',
					},
				},
				error: {
					style: {
						background: '#fef2f2',
						borderColor: '#fecaca',
					},
				},
			}}
		/>

	</HashRouter>
);