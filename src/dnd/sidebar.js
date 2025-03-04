import React, { useContext } from 'react';
import elements from './elements';
import { useDraggable } from '@dnd-kit/core';
import { CanvasContext } from './Context';
import { useSelector } from 'react-redux';

const DraggableItem = ({ label, element }) => {
	const { attributes, setNodeRef, listeners, transform } = useDraggable({ id: label, data: element });

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: {};

	return (
		<>
			<div
				ref={setNodeRef}
				{...listeners}
				{...attributes}
				style={{
					...style,
					width: 'max-content',
					height: 'max-content',
					padding: '10px',
					backgroundColor: 'lightblue',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'grab',
					zIndex: 10,
					position: 'relative',
				}}
			>
				{label}
			</div>
		</>
	);
};

const Sidebar = () => {
	// const { canvasElements, addElement } = useContext(CanvasContext);
	// const handleClick = (element) => {
	// 	addElement(element);
	// };
	return (
		<div
			className='sidebar'
			style={{
				background: '#f5f5f5',
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
					// onPointerDown={() => handleClick(elements[key])}
				>
					<DraggableItem label={elements[key].label} element={elements[key]} />
				</div>
			))}
		</div>
	);
};

export default Sidebar;
