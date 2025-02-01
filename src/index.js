import App from './App';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const element = document?.getElementById('trigger-root');
if (element) {
	const root = ReactDOM.createRoot(element);

	if (root) {
		root.render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		);
	}
}
