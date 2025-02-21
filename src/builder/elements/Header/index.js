import Heading from './Heading';

export const HEADING = {
	label: 'Heading',
	content: '<h2>Heading</h2>',
	position: {
		top: 20,
		left: 80,
	},
	size: {
		width: 120,
		height: 50,
	},
	style: {
		typography: {
			family: 'Lexend',
			type: 'sans-serif',
			height: 1.4,
			weight: 400,
			spacing: 0,
			size: 35,
			fontFamily: 'Lexend',
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
	Component: Heading,
};
