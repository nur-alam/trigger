import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

const App = () => {
	return <h1>Hello WordPress!</h1>;
};

root.render(
	<App />
);