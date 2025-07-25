import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ReduxProvider } from '@/store/ReduxProvider';
import EmailBuilder from './EmailBuilder';
import EmailTemplates from './EmailTemplates';
import { Toaster } from 'react-hot-toast';
import EmailBuilderHeader from './components/EmailBuilderHeader';

const container = document.getElementById('email-builder-root');

if (container) {
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<HashRouter>
				<EmailBuilderHeader />
				<ReduxProvider>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/email-builder" element={
							<EmailBuilder />
						} />
						<Route path="/email-templates" element={
							<EmailTemplates />
						} />
					</Routes>
				</ReduxProvider>

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
		</React.StrictMode>
	);
}
