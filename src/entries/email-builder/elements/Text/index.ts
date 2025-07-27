import { Type } from 'lucide-react';
import TextComponent from './TextComponent';
import { v4 as uuidv4 } from 'uuid';
import { TextElement } from '../types';

export const TEXT_ELEMENT: TextElement = {
	id: uuidv4(),
	type: 'TEXT',
	label: 'Text',
	icon: Type,
	component: TextComponent,
	content: '<p>Hello Text</p>',
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
