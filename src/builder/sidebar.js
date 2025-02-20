import React from 'react';

import elements from './elements';

const Sidebar = ({ onDragStart }) => {
	return (
		<div
			className='sidebar'
			style={{
				background: '#f5f5f5',
				margin: '10px 0px',
				display: 'flex',
				gap: '20px',
				padding: '8px 0px 8px 10px',
				border: '2px solid rgb(221, 221, 221)',
				width: '90%',
			}}
		>
			{Object.keys(elements).map((key, index) => (
				<div
					key={index}
					className={`draggable-item`}
					draggable
					onDragStart={(e) => {
						e.dataTransfer.setData('application/json', JSON.stringify(elements[key]));
					}}
				>
					{elements[key].label}
				</div>
			))}
		</div>
	);
};

export default Sidebar;
