// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

// root.render(<App />);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './styles.css';

// ReactDOM.render(<App />, document.getElementById('trigger-root'));

import React from 'react';
import { JSX } from 'react/jsx-runtime';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

const App = () => {
	return <h1>Hello from TypeScript React in WordPress!</h1>;
};

root.render(
    <App />
);

