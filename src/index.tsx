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
	</HashRouter>
);