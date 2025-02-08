import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
	return <h1>Hello, React World!</h1>;
};

const root = ReactDOM.createRoot(document.getElementById('trigger-root'));

if (root) {
	root.render(<App />);
}
