import Heading from './Heading';
import { v4 as uuidv4 } from 'uuid';

export const HEADING = {
	id: uuidv4(),
	type: 'HEADING',
	label: 'Heading',
	content: '<h2>Heading</h2>',
	position: {
		x: 80,
		y: 80,
	},
	size: {
		width: 210,
		height: 50,
	},
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
			textColor: '#000',
		},
		border: {
			borderColor: '#000',
			borderWidth: 0,
			borderRadius: 0,
			borderStyle: 'solid',
		},
	},
};
