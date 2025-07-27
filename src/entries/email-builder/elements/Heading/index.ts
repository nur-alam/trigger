import { Heading } from 'lucide-react';
import HeadingComponent from './HeadingComponent';
import { v4 as uuidv4 } from 'uuid';
import { HeadingElement } from '../types';

export const HEADING_ELEMENT: HeadingElement = {
	id: uuidv4(),
	type: 'HEADING',
	label: 'Heading',
	icon: Heading,
	component: HeadingComponent,
	content: '<h1>Hello Heading</h1>',
	style: {
		typography: {
			family: 'Lexend',
			type: 'sans-serif',
			fontUrl: '',
			height: 1.4,
			weight: 400,
			spacing: 0,
			size: 35,
		},
		color: {
			textColor: '#000000',
		},
		border: {
			borderColor: '#000000',
			borderWidth: 0,
			borderRadius: 0,
			borderStyle: 'solid',
		},
	},
};
