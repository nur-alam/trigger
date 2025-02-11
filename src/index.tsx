import React from 'react';
import ReactDOM from 'react-dom/client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@components/shadcn-ui/button';
import Card from '@components/card';
import { cn } from '@utils'


const root = ReactDOM.createRoot(document.getElementById('trigger-root') as HTMLElement);

const App = () => {
	return <>
		<Card />
		<Button>Shad Btn</Button>
		<h1 className='p-[21px]'>Hello WordPress!!</h1>
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	</>;
};

root.render(
	<App />
);