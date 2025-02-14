import React from 'react';

const TEXT = {
	label: 'Text',
	content: '<p>Hello Text</p>',
	position: {
		top: 20,
		left: 80,
	},
	size: {
		width: 240,
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
	},
};
const HEADING = {
	label: 'Heading',
	content: '<h2>Heading</h2>',
	position: {
		top: 20,
		left: 80,
	},
	size: {
		width: 240,
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
	},
};

const Sidebar = ({ onDragStart }) => {
	const elements = [TEXT, HEADING];

	return (
		<div className='sidebar'>
			{elements.map((el, index) => (
				<div
					key={index}
					className='draggable-item'
					draggable
					onDragStart={(e) => {
						e.dataTransfer.setData('application/json', JSON.stringify(el));
					}}
				>
					{el.label}
				</div>
			))}
		</div>
	);
};

export default Sidebar;
