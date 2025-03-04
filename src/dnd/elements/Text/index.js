import Text from './Text';
import { v4 as uuidv4 } from 'uuid';

export const TEXT = {
	id: uuidv4(),
	type: 'TEXT',
	label: 'Text',
	content: '<p>Hello Text</p>',
	position: {
		x: 80,
		y: 20,
	},
	size: {
		width: 120,
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
	},
};
