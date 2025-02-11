import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from '@components/card';
import { Button } from '@components/ui/button';


const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

const App = () => {
	return <>
		<Card/>
		<Button>Shad Btn</Button>
		<h1 className='p-[21px]'>Hello WordPress!</h1>
	</>;
};

root.render(
	<App />
);